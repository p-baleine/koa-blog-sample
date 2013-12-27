var koa = require('koa'),
    route = require('koa-route'),
    common = require('koa-common'),
    session = require('koa-session'),

    admin = require('./admin'),
    post = require('./routes/post'),
    comment = require('./routes/comment'),

    app = koa();

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
