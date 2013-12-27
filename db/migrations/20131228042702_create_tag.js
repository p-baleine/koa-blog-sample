
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('tags', function(t) {
      t.increments().primary();
      t.string('text').notNull();
      t.timestamps();
    }),

    knex.schema.createTable('posts_tags', function(t) {
      t.increments().primary();
      t.integer('post_id').notNull().references('id').inTable('posts');
      t.integer('tag_id').notNull().references('id').inTable('tags');
      t.timestamps();
      t.unique(['post_id', 'tag_id'], 'post_tag_index');
    })
  ]).then(function() {
    return knex('tags').insert(['Node.js', 'koa', 'express'].map(function(tag) {
      return { text: tag, created_at: new Date() };
    }));
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tags'),
    knex.schema.dropTable('posts_tags')
  ]);
};
