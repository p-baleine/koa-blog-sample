#!/usr/bin/env node --harmony

var co = require('co');
var prompt = require('prompt');
var User = require('../lib/models/user');

// create user from prompt.

prompt.start();

prompt.get(['email', 'password'], function(err, result) {
  if (err) { throw err; }

  co(function * () {
    var user = new User(result);

    if (!(yield user.save())) {
      console.error(user.getValidationErrors().join('¥n'));
    } else {
      console.log('User %d is created.', user.id);
    }

    process.exit();
  })(console.error);
});
