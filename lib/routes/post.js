var parse = require('co-body'),
    ValidatorError = require('validator').ValidatorError,
    render = require('../render'),
    Post = require('../models/post');

exports.index = function *() {
  var posts = yield Post.findAll();
  this.body = yield render('post/index', { posts: posts.toJSON() });
}

exports.new = function *() {
  this.body = yield render('post/new');
}

exports.create = function *() {
  var body = yield parse(this);

  if (yield new Post(body.post).save()) {
    this.redirect('/');
  } else {
    return this.redirect('/posts/new');
  }
}
