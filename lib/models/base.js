var Bookshelf = require('bookshelf'),
    config = require('../../db/config'),

    blogBookshelf = Bookshelf.blogBookshelf = Bookshelf.initialize(config.database);

var BaseModel = blogBookshelf.Model.extend({

  hasTimestamps: true

}, {

  findAll: function() {
    var coll = blogBookshelf.Collection.forge([], { model: this });

    return coll.fetch.apply(coll, arguments);
  }

});

module.exports = BaseModel;
