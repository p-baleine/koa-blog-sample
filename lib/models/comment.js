var BaseModel = require('./base');

var Comment = BaseModel.extend({

  tableName: 'comments',

  post: function() {
    return this.belongsTo(require('./post'));
  },

  validate: function(model) {
    this.validator.check(model.get('commenter'), 'commenter is empty').notEmpty();
    this.validator.check(model.get('content'), 'content is empty').notEmpty();
  }

});

module.exports = Comment;
