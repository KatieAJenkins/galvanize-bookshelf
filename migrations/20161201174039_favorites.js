'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites' , function(table){
    //id
    table.increments();
    //book_id
    table.integer('book_id').notNullable();
    table.foreign('book_id').references('books.id').onDelete().index;
    //user_id
    table.integer('user_id').notNullable();
    table.foreign('user_id').references('users.id').onDelete().index;
    // created_at updated_at
    table.timestamps(true,true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
