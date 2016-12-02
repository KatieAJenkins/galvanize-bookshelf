'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites' , function(table) {
    table.increments();

    table.integer('book_id')
      .notNullable()
      .references('id')
      .inTable('books')
      .onDelete('CASCADE')
      .index();


    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();

    // created_at updated_at
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
