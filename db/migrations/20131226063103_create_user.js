
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(t) {
    t.increments().primary();
    t.string('email').notNullable();
    t.string('password').notNullable();
    t.string('salt').notNullable();
    t.timestamps();
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.dopTable('users');  
};
