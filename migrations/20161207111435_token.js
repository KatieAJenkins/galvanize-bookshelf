'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('tokens' , function(table){
    //id
    table.increments();
    //email
    table.string('email').notNullable().defaultTo('');
    //password
    table.string('password').notNullable().defaultTo('');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tokens');
};
