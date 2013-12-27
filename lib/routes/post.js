var parse = require('co-body'),
    render = require('../render'),
    Post = require('../models/post');

// GET /
exports.index = function *() {
  var posts = yield Post.findAll({ withRelated: 'user' });
  this.body = yield render('post/index', { posts: posts.toJSON() });
};

// GET /:post
exports.show = function *(post) {
  var post = yield new Post({ id: post }).fetch({ withRelated: 'user' });
  this.body = yield render('post/show', { post: post.toJSON() });
};

