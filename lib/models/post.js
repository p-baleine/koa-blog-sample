var BaseModel = require('./base');

var Post = BaseModel.extend({

  tableName: 'posts',

  user: function() {
    return this.belongsTo(require('./user'));
  },

  comments: function() {
    return this.hasMany(require('./comment'));
  },

  validate: function(model) {
    this.validator.check(model.get('title'), 'title is empty').notEmpty();
    this.validator.check(model.get('content'), 'content is empty').notEmpty();
  }

});

module.exports = Post;
