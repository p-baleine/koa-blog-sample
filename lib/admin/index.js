var koa = require('koa'),
    route = require('koa-route'),
    common = require('koa-common'),
    render = require('./render'),
    methodOverride = require('../middlewares/method-override'),
    bodyParser = require('../middlewares/body-parser'),
    User = require('../models/user'),

    session = require('./routes/session'),
    post = require('./routes/post'),

    admin = koa();

admin.use(bodyParser());
admin.use(methodOverride());

// root
admin.use(route.get('/', function * () { this.redirect('/admin/posts'); }));

// posts
admin.use(common.mount('/posts', restrict));
admin.use(common.mount('/posts', loadUser));
admin.use(route.get('/posts', post.index));
admin.use(route.get('/posts/new', post.new));
admin.use(route.post('/posts', post.create));
admin.use(route.get('/posts/:post/edit', post.edit));
admin.use(route.put('/posts/:post', post.update));

// /sessions
admin.use(route.get('/sessions/new', session.new));
admin.use(route.post('/sessions', session.create));
admin.use(route.delete('/sessions', session.destroy));

function *restrict(next) {
  if (!this.session.user_id) { this.throw('not logged in', 403); }

  yield next;
}

function *loadUser(next) {
  if (!this.session.user_id) { return (yield next); }

  var user = yield new User({ id: this.session.user_id }).fetch();

  this.user = user;

  // assign `toJSON`ed user data to `render.locals`
  render.locals = render.locals || {};
  render.locals.user = user.toJSON();

  yield next;
}

module.exports = admin;
