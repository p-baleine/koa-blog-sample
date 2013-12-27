var parse = require('co-body'),
    ValidatorError = require('validator').ValidatorError,
    render = require('../render'),
    Post = require('../../models/post');

// GET /
exports.index = function *() {
  var posts = yield Post.findAll({ withRelated: ['user'] });
  this.body = yield render('post/index', { posts: posts.toJSON() });
}

// GET /new
exports.new = function *() {
  this.body = yield render('post/new', { post: new Post().toJSON() });
}

// POST /
exports.create = function *() {
  var post = new Post(this.req.body.post);

  post.set('user_id', this.user.id);

  if (yield post.save()) {
    this.redirect('/admin/posts');
  } else {
    this.body = yield render('post/new', { post: post.toJSON() });
  }
}
