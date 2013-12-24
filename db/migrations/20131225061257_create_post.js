
exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', function(t) {
    t.increments().primary();
    t.string('title').notNullable();
    t.text('content').notNullable();
    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dopTable('posts');
};
