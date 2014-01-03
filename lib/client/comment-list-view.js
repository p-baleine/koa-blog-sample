var Backbone = require('backbone');
var CommentItemView = require('./comment-item-view');

var CommentListView = Backbone.View.extend({
  tagName: 'ul',

  initialize: function() {
    this.listenTo(this.collection, 'add', this.renderOne, this);
  },

  setChildElements: function() {
    this.$('.comment').each(Backbone.$.proxy(function(idx, elt) {
      var commentId = Number(Backbone.$(elt).data('comment-id')),
          comment = this.collection.get(commentId),
          view = new CommentItemView({ model: comment });

      view.setElement(elt);
    }, this));
    return this;
  },

  renderOne: function(model) {
    this.$el.append(new CommentItemView({ model: model }).render().el);
    return this;
  }
});

module.exports = CommentListView;
