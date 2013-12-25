var inherits = require('util').inherits,
    Validator = require('validator').Validator;

// BaseValidator
function BaseValidator() {
  Validator.apply(this, arguments);
  this._errors = [];
}

// inherits from `Validator`
inherits(BaseValidator, Validator);

// override
BaseValidator.prototype.error = function(msg) {
  this._errors.push(msg);
};

// get error messages
BaseValidator.prototype.getErrors = function() {
  return this._errors;
};

// retrun true if has errors
BaseValidator.prototype.hasErrors = function() {
  return this._errors.length !== 0;
};

// expose `BaseValidator`
module.exports = BaseValidator;
