var koa = require('koa'),
    route = require('koa-route'),
    common = require('koa-common'),

    session = require('./routes/session'),
    post = require('./routes/post'),

    admin = koa();

admin.use(common.mount('/posts', function *(next) {
  if (!this.session.user_id) {
    // TODO error handling
    throw new Error('not logged in');
  }

  yield next;
}));

// TODO root route

// /sessions
admin.use(route.get('/sessions/new', session.new));
admin.use(route.post('/sessions', session.create));

// posts
admin.use(route.get('/posts', post.index));

module.exports = admin;
