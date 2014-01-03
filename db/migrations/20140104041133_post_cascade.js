
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.raw('ALTER TABLE comments DROP CONSTRAINT comments_post_id_foreign'),
    knex.raw('ALTER TABLE comments ADD CONSTRAINT comments_post_id_foreign FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE'),
    knex.raw('ALTER TABLE posts_tags DROP CONSTRAINT posts_tags_post_id_foreign'),
    knex.raw('ALTER TABLE posts_tags ADD CONSTRAINT posts_tags_post_id_foreign FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE')
  ]);
};

exports.down = function(knex, Promise) {
  
};
