var Backbone = require('backbone');
var CommentListView = require('./comment-list-view');
var Comment = require('./comments').Comment;

var AppView = Backbone.View.extend({
  events: {
    'submit form': 'create'
  },

  initialize: function(options) {
    this.comments = options.comments;
  },

  render: function() {
    new CommentListView({ el: this.$('ul'), collection: this.comments }).setChildElements();
  },

  create: function(e) {
    e.preventDefault();

    var commenter = this.$('[name="comment[commenter]"]');
    var content = this.$('[name="comment[content]"]');
    var comment = new Comment({ commenter: commenter.val(), content: content.val() });

    this.listenTo(comment, 'invalid', this.invalid, this);

    if (this.comments.create(comment, { error: this.error })) {
      commenter.val('');
      content.val('');
    }
  },

  error: function(model, response) {
    alert(response.responseText);
  },

  invalid: function(model, errors) {
    // TODO replace with use errors.jade
    console.log(arguments);
    this.$('.errors').html(errors.join('<br/>'));
  }
});

module.exports = AppView;
