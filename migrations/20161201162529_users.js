'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users' , function(table){
    //id
    table.increments();
    //first_name
    table.varchar('first_name').notNullable().defaultTo('');
    //last_name
    table.varchar('last_name').notNullable().defaultTo('');
    // email
    table.varchar('email').notNullable().unique;
    // hashed_password
    table.specificType('hashed_password', 'char(60)').notNullable();
    // created_at updated_at
    table.timestamps(true,true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
