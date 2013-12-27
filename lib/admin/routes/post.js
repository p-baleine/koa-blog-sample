var parse = require('co-body');
var ValidatorError = require('validator').ValidatorError;
var render = require('../render');
var Post = require('../../models/post');
var Tag = require('../../models/tag');

// GET /
exports.index = function *() {
  var posts = yield Post.findAll({ withRelated: ['user', 'comments'] });
  this.body = yield render('post/index', { posts: posts.toJSON() });
}

// GET /new
exports.new = function *() {
  var tags = yield Tag.findAll();
  this.body = yield render('post/new', { post: new Post().toJSON(), tags: tags.toJSON() });
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
