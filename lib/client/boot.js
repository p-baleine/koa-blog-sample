var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var App = require('./app-router');
var Comments = require('./comments');

$(function() {
  new App({ comments: new Comments(window.comments, { postId: window.postId }) });
  Backbone.history.start();
});
