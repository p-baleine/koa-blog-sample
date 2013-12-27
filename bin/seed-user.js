#!/usr/bin/env node

var prompt = require('prompt');
var User = require('../lib/models/user');

// create user from prompt.

console.log('\n\nPlease enter user information:');

prompt.start();

prompt.get(['email', 'name', 'password'], function(err, result) {
  if (err) { throw err; }

  var user = new User(result);

  user.save()
    .then(function(created) {
      if (created) {
        console.log('User %d is created.', user.id);
      } else {
        console.error(user.getValidationErrors().join('\n'));
      }
    })
    .catch(console.error)
    .finally(process.exit);
});
