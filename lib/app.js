var koa = require('koa'),
    route = require('koa-route'),
    common = require('koa-common'),

    post = require('./routes/post'),

    app = koa();

app.use(common.favicon());

if ('development' === app.env) {
  app.use(common.logger());
}

// route middleware

app.use(route.get('/', post.index));
app.use(route.get('/posts', post.index));
app.use(route.get('/posts/new', post.new));
app.use(route.post('/posts', post.create));

module.exports = app;
