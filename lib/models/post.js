var BaseModel = require('./base'),
    check = require('validator').check;

var Post = BaseModel.extend({

  tableName: 'posts',

  initialize: function() {
    this.on('saving', this.validate, this);
  },

  validate: function(model) {
    check(model.get('title')).notEmpty();
    check(model.get('content')).notEmpty();
  }

});

module.exports = Post;

