const CommentParser = require('../lib/commentParser.js');
CommentParser.construct();

CommentParser.getComments('https://www.youtube.com/watch?v=dQw4w9WgXcQ', (commentThread) => {
    console.log('-----------------------------------');
    console.log('Comment: ' + commentThread.comment);
    console.log('Author: ' + commentThread.author);
    console.log('Likes: ' + commentThread.likesCount);
    console.log('Published: ' + commentThread.publishedTime);
    console.log('-----------------------------------');
});