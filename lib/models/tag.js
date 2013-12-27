var BaseModel = require('./base');

var Tag = BaseModel.extend({

  tableName: 'tags',

  posts: function() {
    return this.belongsToMany(require('./post'));
  }

});

module.exports = Tag;

