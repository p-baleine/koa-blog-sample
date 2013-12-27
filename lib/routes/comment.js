var parse = require('co-body');
var render = require('../render');
var Post = require('../models/post');
var Comment = require('../models/comment');

// POST /
exports.create = function *(postId) {
  var post = yield new Post({ id: postId }).fetch({ withRelated: ['user', 'comments'] });

  if (!post) { this.throw(404); }

  var data = yield parse(this);
  var comment = new Comment(data.comment);

  comment.set('post_id', postId);

  if (yield comment.save()) {
    this.redirect('/posts/' + postId);
  } else {
    this.body = yield render('post/show', { post: post.toJSON(), newComment: comment.toJSON() });
  }
};
