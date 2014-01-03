var Backbone = require('backbone');
var AppView = require('./app-view');
var CommentListView = require('./comment-list-view');

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index'
  },

  initialize: function(options) {
    this.comments = options.comments;
  },

  index: function() {
    new AppView({ el: '.comments', comments: this.comments }).render();
  }
});

module.exports = AppRouter;
