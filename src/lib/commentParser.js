const Requester = require('./requester');
const CommentThread = require('./commentThread');

let CommentParser = function () {

    var self = this;

    /**
     * Constructor
     */
    this.construct = function () {
        Requester.headers = {
            'Host': 'www.youtube.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0',
            'X-YouTube-Client-Name': '1',
            'X-YouTube-Client-Version': '2.20180714',
            'X-YouTube-Page-CL': '204764805',
            'X-YouTube-Page-Label': 'youtube.ytfe.desktop_20180713_8_RC1',
            'X-YouTube-Utc-Offset': '120',
            'DNT': 1,
            'Connection': 'keep-alive'
        };
    };

    /**
     * Get required rokens for cookie header
     * @param vidUrl
     * @param callback
     */
    this.getTokens = function (vidUrl, callback) {
        Requester.doGet(vidUrl + '&pbj=1', function (err, resp, body) {
            if (err) {
                console.log(err);
                return;
            }

            let json = JSON.parse(body);
            let nextContinuation = json[3].response.contents.twoColumnWatchNextResults.results.results.contents[2].itemSectionRenderer.continuations[0].nextContinuationData;

            let tokens = {
                session_token: encodeURIComponent(json[3].xsrf_token),
                continuation: encodeURIComponent(nextContinuation.continuation),
                itct: encodeURIComponent(nextContinuation.clickTrackingParams)
            };

            callback(tokens);
        });
    };

    /**
     * Get all comments
     * @param url: string video url
     * @param callback
     */
    this.getComments = function (url, callback) {
        Requester.getCookies('https://www.youtube.com/', (cookies) => {

            Requester.headers['Cookie'] = 'VISITOR_INFO1_LIVE=' + cookies.VISITOR_INFO1_LIVE + '; PREF=' + cookies.PREF + '; YSC=' + cookies.YSC + '; GPS=' + cookies.GPS + '; CONSENT=' + cookies.CONSENT;

            this.getTokens(url, (tokens) => {

                formData = 'session_token=' + tokens.session_token;
                Requester.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                Requester.headers['Content-Length'] = formData.length;
                Requester.headers['Referer'] = url + '&t=5s';

                this.continueParsing({
                    itct: tokens.itct,
                    continuation: tokens.continuation,
                    session_token: tokens.session_token,
                    callback: callback
                });
            });
        });
    };

    /**
     * Parse next part of comment section (see this.getComments())
     * @param options: array of options
     */
    this.continueParsing = function (options) {
        Requester.doPost(
            'https://www.youtube.com/comment_service_ajax?action_get_comments=1&pbj=1&ctoken=' +
            options.continuation +
            '&continuation=' +
            options.continuation +
            '&itct=' +
            options.itct,

            'session_token=' + options.session_token,

            function (err, resp, body) {
                if (err) {
                    console.log(err);
                    return;
                }

                let json = JSON.parse(body);
                if (json.response.continuationContents === undefined) {
                    //console.log('End of comment section reached!');
                    return;
                }
                let itemSection = json.response.continuationContents.itemSectionContinuation;

                for (let item in itemSection.contents) {
                    let thread = itemSection.contents[item].commentThreadRenderer.comment.commentRenderer;

                    let commentThread = new CommentThread();

                    try {
                        commentThread.commentThreadObj.author = thread.authorText.simpleText;
                        commentThread.commentThreadObj.authorThumbNail = thread.authorThumbnail.thumbnails[0].url;
                        commentThread.commentThreadObj.authorChannel = thread.authorEndpoint.commandMetadata.webCommandMetadata.url;
                        commentThread.commentThreadObj.comment = commentThread.mergeCommentText(thread.contentText);
                        commentThread.commentThreadObj.publishedTime = thread.publishedTimeText.runs[0].text;
                        commentThread.commentThreadObj.likesCount = thread.likeCount;
                        commentThread.commentThreadObj.isChannelOwner = thread.authorIsChannelOwner;

                        options.callback(commentThread.commentThreadObj);
                    } catch (e) {
                        console.error('unknown error: ' + e.toString());
                    }
                }

                if ('continuations' in itemSection) {
                    options.continuation = encodeURIComponent(itemSection.continuations[0].nextContinuationData.continuation);
                    self.continueParsing(options);
                }
            });
    }
};

module.exports = new CommentParser();