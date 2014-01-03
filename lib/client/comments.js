var Backbone = require('backbone');

var Comment = Backbone.Model.extend({
  validate: function(attrs, options) {
    // TODO replace with `lib/models/comment` 's validation logic
    var errors = [];

    if (attrs.commenter === '') { errors.push('commenter is empty'); }
    if (attrs.content === '') { errors.push('content is empty'); }

    return errors.length > 0 ? errors : undefined;
  }
});

var Comments = Backbone.Collection.extend({
  model: Comment,

  url: function() {
    return '/posts/' + this.postId + '/comments' ;
  },

  initialize: function(models, options) {
    this.postId = options.postId;
  }
});

module.exports = Comments;
module.exports.Comment = Comment;
