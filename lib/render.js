var views = require('co-views'),
    join = require('path').join;

module.exports = views(join(__dirname, 'views'), {
  ext: 'jade'
});
