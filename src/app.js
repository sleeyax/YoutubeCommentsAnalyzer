const CommentParser = require('./lib/commentParser.js');
CommentParser.construct();
const WordList = require('./lib/wordList');

const args = process.argv;
switch (args[2]) {
    case 'wordlist':
        switch (args[3]) {
            case 'fetch':
                WordList.clear();
                CommentParser.getComments(args[4], (commentThreadObj) => {
                    WordList.write(commentThreadObj.comment.toLowerCase().trim());
                });
                break;
            case 'clear':
                WordList.clear();
                break;
            case 'show':
                WordList.prettyPrint(WordList.get(), args[4]);
                break;
            case 'count':
                WordList.getCount();
                break;
            case 'export':
                console.log(args[5]);
                console.log('---------------------');
                WordList.prettyPrint(WordList.get(), args[4]);
                break;
        }
        break;
    case 'comments':
        if (args[3] === 'show') {
            CommentParser.getComments(args[4], (commentThreadObj) => {
                console.log(commentThreadObj.comment);
            });
        }
        break;
    case 'help':
    default:
        console.log(
            'Known commands:\n' +
            'node app.js wordlist fetch <link> - (re)download comments and update wordlist\n' +
            'node app.js wordlist clear - clear wordlist\n' +
            'node app.js wordlist count - count items in wordlist\n' +
            'node app.js wordlist show <limit> - pretty print (part of) wordlist\n' +
            'node app.js wordlist export <limit> <message> - same as wordlist show, but adds a header with message\n' +
            'node app.js comments show <url> - print all comments\n' +
            'node app.js help - show this help message'
        );
        break;
}