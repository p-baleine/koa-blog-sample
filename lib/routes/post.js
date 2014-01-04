var parse = require('co-body');
var render = require('../render');
var Post = require('../models/post');

// GET /
exports.index = function *() {
  var posts = yield Post.query('orderBy', 'created_at', 'desc')
        .fetch({ withRelated: ['user', 'comments', 'tags'] });
  this.body = yield render('post/index', { posts: posts.toJSON() });
};

// GET /:post
exports.show = function *(postId) {
  var post = yield new Post({ id: postId }).fetch({ withRelated: ['user', 'comments', 'tags'] });

  if (!post) { this.throw(404); }

  this.body = yield render('post/show', { post: post.toJSON(), csrf: this.csrf });
};

