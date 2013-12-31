
exports.up = function(knex, Promise) {
  return knex.raw('ALTER TABLE posts_tags DROP CONSTRAINT post_tag_index;')
    .then(function() {
      return knex.schema.table('posts_tags', function(t) {
        t.dropColumn('id');
        t.primary(['post_id', 'tag_id']);
      });
  });
};

exports.down = function(knex, Promise) {
  
};
