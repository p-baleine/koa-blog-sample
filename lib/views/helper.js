var _ = require('lodash');
var moment = require('moment');

module.exports = exports = locals;

function locals(obj) {
  return function *(next) {
    var expose = {
      formatDate: exports.formatDate
    };

    if (this.req.url.match(/\/(edit|new)/)) { expose.csrf = this.csrf; }

    obj.locals = _.extend({}, obj.locals, expose);

    yield next;
  };
}

exports.formatDate = function(date) {
  return moment(date).format();
};
