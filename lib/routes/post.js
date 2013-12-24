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
  var post;

  try {
    post = yield new Post(body.post).save();
  } catch(e) {
    if (!(e instanceof ValidatorError)) { throw e; }
    return this.redirect('/posts/new');
  }

  this.redirect('/');
}
