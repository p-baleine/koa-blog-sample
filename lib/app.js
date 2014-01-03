var koa = require('koa');
var route = require('koa-route');
var common = require('koa-common');
var session = require('koa-session');
var join = require('path').join;
var config = require('config');
var render = require('./render');
var locals = require('./views/helper');

var admin = require('./admin');
var post = require('./routes/post');
var comment = require('./routes/comment');

var app = koa();

app.keys = config.secret;

app.use(common.favicon());
app.use(common.logger());
app.use(common.static(join(__dirname, '..', 'public')));
app.use(session());
app.use(locals(render));

// /admin
app.use(common.mount('/admin', admin));

// /posts
app.use(route.get('/', post.index));
app.use(route.get('/posts', post.index));
app.use(route.get('/posts/:post', post.show));

// /posts/:post/comments
app.use(route.post('/posts/:post/comments', comment.create));

module.exports = app;
