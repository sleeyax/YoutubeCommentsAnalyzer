const CommentParser = require('../lib/commentParser.js');
CommentParser.construct();

CommentParser.getComments('https://www.youtube.com/watch?v=dQw4w9WgXcQ', (commentThread) => {
    console.log(commentThread.comment);
});