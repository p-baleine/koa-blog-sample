var Backbone = require('backbone');

var CommentItemView = Backbone.View.extend({
  tagName: 'li',

  className: 'comment',

  render: function() {
    this.$el.html(this.template({ comment: this.model.toJSON() }));
    return this;
  },

  template: require('../views/post/comment.jade')
});

module.exports = CommentItemView;
