
var CommentThread = function() {
    /**
     * Comment thread object
     * @type {{author: string, authorThumbNail: string, authorChannel: string, comment: string, publishedTime: string, likesCount: number, isChannelOwner: boolean}}
     */
    this.commentThreadObj = {
        author: '',
        authorThumbNail: '',
        authorChannel: '',
        comment: '',
        publishedTime: '',
        likesCount: 0,
        isChannelOwner: false,
    };

    /**
     * Merge comment text into one
     * e.g when someone uses bold text, the comment is split up in multiple parts (bold part and normal text part)
     * @param comment
     * @returns {*|string}
     */
    this.mergeCommentText = function(comment) {
        return (Array.isArray(comment.runs)) ? comment.runs.map((item) => {
            return item.text;
        }).join('') : comment.simpleText;
    }
};

module.exports = CommentThread;