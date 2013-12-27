var koa = require('koa'),
    route = require('koa-route'),
    common = require('koa-common'),
    render = require('./render'),
    User = require('../models/user'),

    session = require('./routes/session'),
    post = require('./routes/post'),

    admin = koa();

// TODO link post to user
// TODO root route

// posts
admin.use(common.mount('/posts', restrict));
admin.use(common.mount('/posts', loadUser));

admin.use(route.get('/posts', post.index));

// /sessions
admin.use(route.get('/sessions/new', session.new));
admin.use(route.post('/sessions', session.create));
admin.use(route.delete('/sessions', session.destroy));

function *restrict(next) {
  if (!this.session.user_id) { return this.throw('not logged in', 403); }

  yield next;
}

function *loadUser(next) {
  if (!this.session.user_id) { return (yield next); }

  var user = yield new User({ id: this.session.user_id }).fetch();

  render.locals = render.locals || {};
  this.user = render.locals.user = user.toJSON();

  yield next;
}

module.exports = admin;
