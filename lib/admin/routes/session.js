var parse = require('co-body'),
    render = require('../render'),
    User = require('../../models/user');

// GET /new
exports.new = function *() {
  this.body = yield render('session/new');
};

// POST /
exports.create = function *() {
  var body = yield parse(this);
  var data = body.user;
  var user;

  if ((user = yield User.authenticate(data.email, data.password))) {
    this.session.user_id = user.id;
    this.redirect('/admin');
  } else {
    this.session.user_id = null;
    this.status = 404;
    this.body = yield render('session/new');
  }
};
