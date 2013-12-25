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
  this.body = yield render('post/new');
}

// POST
exports.create = function *() {
  var body = yield parse(this),
      post;

  if (yield new Post(body.post).save()) {
    this.redirect('/');
  } else {
    // エラーをコレクトしてメッセージのゲッターを設ける、例外を投げる機構はそのままで良いか
    this.body = yield render('post/new', { errors: ['エラー'] });
  }
}
