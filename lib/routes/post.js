var parse = require('co-body'),
    ValidatorError = require('validator').ValidatorError,
    render = require('../render'),
    Post = require('../models/post');

// GET /
exports.index = function *() {
  var posts = yield Post.findAll();
  this.body = yield render('post/index', { posts: posts.toJSON() });
}

// GET /new
exports.new = function *() {
  this.body = yield render('post/new', { post: new Post().toJSON() });
}

// POST /
exports.create = function *() {
  var body = yield parse(this);
  var post = new Post(body.post);

  if (yield post.save()) {
    this.redirect('/');
  } else {
    this.body = yield render('post/new', { post: post.toJSON() });
  }
}
