
exports.up = function(knex, Promise) {
  return Promise.all([
    knex('posts').del(),
    knex('users').del(),
    knex.schema.table('users', function(t) {
      t.string('name').notNull();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.dropColumn('name');
  });  
};
