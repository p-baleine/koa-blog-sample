
exports.up = function(knex, Promise) {
  return Promise.all([
    knex('posts').del(), // delete users for new column's not null restriction.
    knex.schema.table('posts', function(t) {
      t.integer('user_id').notNull().references('id').inTable('users');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return knex.schema.table('posts', function(t) {
    t.dropColumn('user_id');
  });  
};
