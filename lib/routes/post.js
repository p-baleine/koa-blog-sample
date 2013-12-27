var parse = require('co-body'),
    render = require('../render'),
    Post = require('../models/post');

// GET /
exports.index = function *() {
  var posts = yield Post.findAll();
  this.body = yield render('post/index', { posts: posts.toJSON() });
};

