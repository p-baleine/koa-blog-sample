var Bookshelf = require('bookshelf'),
    ValidatorError = require('validator').ValidatorError,
    config = require('../../db/config'),

    blogBookshelf = Bookshelf.blogBookshelf = Bookshelf.initialize(config.database);

var BaseModel = blogBookshelf.Model.extend({

  hasTimestamps: true,

  // override
  //
  // return result if save success.
  // return `false` if ValidatorError is thrown
  save: function * () {
    var result;

    try {
      result = yield blogBookshelf.Model.prototype.save.apply(this, arguments);
    } catch(e) {
      if (!(e instanceof ValidatorError)) { throw e; }
      return false;      
    }

    return result;
  }

}, {

  findAll: function() {
    var coll = blogBookshelf.Collection.forge([], { model: this });

    return coll.fetch.apply(coll, arguments);
  }

});

module.exports = BaseModel;
