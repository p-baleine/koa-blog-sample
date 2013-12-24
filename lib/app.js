var koa = require('koa'),
    route = require('koa-route'),

    post = require('./routes/post'),

    app = koa();

app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// route middleware

app.use(route.get('/', post.index));
app.use(route.get('/posts', post.index));
app.use(route.get('/posts/new', post.new));
app.use(route.post('/posts', post.create));

module.exports = app;
