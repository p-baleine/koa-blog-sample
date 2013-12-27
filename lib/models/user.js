var Promise = require('bluebird'),
    bcrypt = Promise.promisifyAll(require('bcrypt')),
    BaseModel = require('./base');

var User = BaseModel.extend({

  HASH_COUNT: 10,

  tableName: 'users',

  initialize: function() {
    BaseModel.prototype.initialize.apply(this, arguments);
    this.on('saving', this.hashPassword, this);
  },

  validate: function(model) {
    this.validator.check(model.get('email'), 'email is empty').notEmpty();
    this.validator.check(model.get('password'), 'password is empty').notEmpty();
  },

  // generate a salt and hash password with the salt
  // set the hased password and the salt.
  hashPassword: function() {
    var _this = this;

    return bcrypt.genSaltAsync(_this.HASH_COUNT)
      .then(function(salt) {
        _this.set('salt', salt);
        return bcrypt.hashAsync(_this.get('password'), salt);
      })
      .then(function(hash) {
        return _this.set('password', hash);
      });
  }

}, {

  authenticate: function(email, password) {
    return new this({ email: email }).fetch({ require: true })
      .then(function(user) {
        return [bcrypt.hashAsync(password, user.get('salt')), user];
      })
      .spread(function(hash, user) {
        if (hash === user.get('password')) { return user; }
        return false;
      })
      .catch(function(e) {
        if (e.message === 'EmptyResponse') { return false; }
        throw e;
      });
  }

});

module.exports = User;
