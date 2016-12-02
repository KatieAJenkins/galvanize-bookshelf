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

// ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
// │                                         favorites                                               │
// ├────────────────┬─────────────────────────┬──────────────────────────────────────────────────────┤
// │id              │serial                   │primary key                                           │
// │book_id         │integer                  │not null references books(id) on delete cascade index │
// |user_id         │integer                  │not null references users(id) on delete cascade index │
// │created_at      │timestamp with time zone │not null default now()                                │
// │updated_at      │timestamp with time zone │not null default now()                                │
// └────────────────┴─────────────────────────┴──────────────────────────────────────────────────────┘
