var parse = require('co-body');
var methods = require('methods');
var debug = require('debug')('methodOverride');

module.exports = methodOverride;

function methodOverride(key) {
  key = key || '_method';

  return function * (next) {
    if (this.method.toLowerCase() !== 'post') { return (yield next); }

    var body = this.req.body;
    var method;

    this.originalMethod = this.originalMethod || this.method;

    if (body && key in body) {
      method = body[key].toLowerCase();
      delete body[key];
    }

    if (supports(method)) {
      this.method = method.toUpperCase();
    }

    yield next;
  };
}

function supports(method){
  return ~methods.indexOf(method);
}

