var BaseModel = require('./base');

var Post = BaseModel.extend({

  tableName: 'posts',

  user: function() {
    return this.belongsTo(require('./user'));
  },

  validate: function(model) {
    this.validator.check(model.get('title'), 'title is empty').notEmpty();
    this.validator.check(model.get('content'), 'content is empty').notEmpty();
  }

});

module.exports = Post;
