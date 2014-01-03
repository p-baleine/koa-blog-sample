var co = require('co');
var Base = require('../../lib/models/base');
var Bookshelf = require('bookshelf').blogBookshelf;
var knex = Bookshelf.knex;

beforeEach(function(done) {
  co(function *(){
    yield knex('comments').del();
    yield knex('posts_tags').del();
    yield knex('posts').del();
    yield knex('users').del();
  })(done);
});
