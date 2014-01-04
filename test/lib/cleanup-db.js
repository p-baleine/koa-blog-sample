var co = require('co');

module.exports = cleanUp;

function cleanUp(knex) {
  beforeEach(function(done) {
    co(function *(){
      yield knex('comments').del();
      yield knex('posts_tags').del();
      yield knex('posts').del();
      yield knex('users').del();
    })(done);
  });
}
