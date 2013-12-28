var Bookshelf = require('bookshelf');
var ValidatorError = require('validator').ValidatorError;
var BaseValidator = require('../base-validator');
var config = require('config').database;

var blogBookshelf = Bookshelf.blogBookshelf = Bookshelf.initialize(config);

var BaseModel = blogBookshelf.Model.extend({

  hasTimestamps: true,

  initialize: function() {
    this.on('saving', this.wrapValidate, this);
    this.validator = new BaseValidator();
  },

  // abstract method
  //
  // descendant class may override this method to
  // add validation logic by `this.validator`.
  validate: function() {
  },

  // private
  wrapValidate: function() {
    this.validate(this);
    if (this.validator.hasErrors()) { throw new ValidatorError(this.validator.getErrors()); }
  },

  // override
  //
  // return result if save success.
  // return `false` if ValidatorError is thrown
  save: function (params, options) {
    return blogBookshelf.Model.prototype.save.apply(this, arguments)
      .catch(function(e) {
        if ((options && options.throwOnValidationError) ||
            !(e instanceof ValidatorError)) { throw e; }
        return false;
      });
  },

  // override
  //
  // add error messages to response if `this.validator` has errors
  toJSON: function() {
    var json = blogBookshelf.Model.prototype.toJSON.apply(this, arguments);

    if (this.validator.hasErrors()) { json.errors = this.validator.getErrors(); }

    return json;
  },

  // return validation errors collected on the last field validation.
  getValidationErrors: function() {
    return this.validator.getErrors();
  }

}, {

  findAll: function() {
    var coll = blogBookshelf.Collection.forge([], { model: this });

    return coll.fetch.apply(coll, arguments);
  },

  query: function() {
    var coll = blogBookshelf.Collection.forge([], { model: this });

    return coll.query.apply(coll, arguments);
  }

});

module.exports = BaseModel;
