var _ = require('lodash');
var moment = require('moment');

module.exports = exports = locals;

function locals(obj) {
  return function *(next) {
    obj.locals = _.extend({}, obj.locals, {
      formatDate: exports.formatDate
    });

    yield next;
  };
}

exports.formatDate = function(date) {
  return moment(date).format();
};
