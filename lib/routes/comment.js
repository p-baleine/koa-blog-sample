var parse = require('co-body');
var _ = require('lodash');
var render = require('../render');
var Post = require('../models/post');
var Comment = require('../models/comment');

// POST /
exports.create = function *(postId) {
  var comment = new Comment(this.req.body);

  comment.set('post_id', postId);

  if (yield comment.save()) {
    this.body = comment;
  } else {
    this.throw(422);
  }
};
