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

// GET /:post/edit
exports.edit = function *(postId) {
  var post = yield new Post({ id: postId }).fetch({ withRelated: 'tags' });
  var tags = yield Tag.findAll();

  if (!post) { this.throw(404); }

  this.body = yield render('post/edit', { post: post.toJSON(), tags: tags.toJSON() });
};

// PUT /:post
exports.update = function *(postId) {
  var post = yield new Post({ id: postId }).fetch({ withRelated: 'tags' });
  var tags = yield Tag.findAll();

  if (!post) { this.throw(404); }

  post.set(this.req.body.post);

  if (yield post.save()) {
    this.redirect('/admin/posts');
  } else {
    this.body = yield render('post/edit', { post: post.toJSON(), tags: tags.toJSON() });
  }
};

