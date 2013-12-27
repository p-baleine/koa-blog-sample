
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function(t) {
    t.increments().primary();
    t.integer('post_id').notNull().references('id').inTable('posts');
    t.string('commenter').notNullable();
    t.text('content').notNullable();
    t.timestamps();
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.dopTable('comments');
};
