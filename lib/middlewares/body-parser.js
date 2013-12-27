var parse = require('co-body');
var methods = require('methods');
var debug = require('debug')('bodyParser');

module.exports = bodyParser;

function bodyParser() {
  return function *(next) {
    if (~['get'].indexOf(this.method.toLowerCase())) { return (yield next); }

    this.req.body = yield parse(this);

    yield next;
  };
}

