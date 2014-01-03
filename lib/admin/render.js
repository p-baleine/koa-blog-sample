var views = require('co-views');
var join = require('path').join;
var _ = require('lodash');
var originalRender = views(join(__dirname, 'views'), { ext: 'jade' });

module.exports = function render(view, opts) {
  opts = _.extend({}, opts, render.locals);
  return originalRender(view, opts);
};
