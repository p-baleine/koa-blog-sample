var views = require('co-views');
var join = require('path').join;

module.exports = views(join(__dirname, 'views'), {
  ext: 'jade'
});
