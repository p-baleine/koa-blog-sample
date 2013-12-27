var koa = require('koa');
var route = require('koa-route');
var common = require('koa-common');
var session = require('koa-session');

var admin = require('./admin');
var post = require('./routes/post');
var comment = require('./routes/comment');

var app = koa();

app.use(common.favicon());

if ('development' === app.env) {
  app.use(common.logger());
}

app.keys = ['some secret hurr'];
app.use(session());

// /admin
app.use(common.mount('/admin', admin));

// /posts
app.use(route.get('/', post.index));
app.use(route.get('/posts', post.index));
app.use(route.get('/posts/:post', post.show));

// /posts/:post/comments
app.use(route.post('/posts/:post/comments', comment.create));

module.exports = app;
