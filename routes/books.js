'use strict';

const express = require('express');
const knex = require('../knex');
const {
    camelizeKeys,
    decamelizeKeys
} = require('humps');

const router = express.Router();
const boom = require('boom');

router.get('/books', (req, res, next) => {
    knex('books')
        .orderBy('title')
        .then((books) => {
            const booksCamel = camelizeKeys(books);
            res.send(booksCamel);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/books/:id', (req, res, next) => {
    knex('books')
        .where('id', req.params.id)
        .first()
        .then((book) => {
            const bookCamel = camelizeKeys(book);
            if (!book) {
                return next();
            }

            res.send(bookCamel);
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/books', (req, res, next) => {
    var body = req.body;
    var newBook = {
        title: body.title,
        author: body.author,
        genre: body.genre,
        description: body.description,
        cover_url: body.coverUrl
    };

    var errObj = {
      title: boom.create(400, 'Title must not be blank'),
      author: boom.create(400, 'Author must not be blank'),
      genre: boom.create(400, 'Genre must not be blank'),
      description: boom.create(400, 'Description must not be blank'),
      cover_url: boom.create(400, 'Cover URL must not be blank')
    };

    for (var key in newBook) {
      if (!(newBook[key])) {
        next(errObj[key]);
        return;
      }
    }

    knex('books')
        .insert(decamelizeKeys(newBook), "*")
        .then((data) => { //data = the object that comes back
            const deCamelBook = data[0]; //finding object in array

            delete deCamelBook.created_at; //delete key from Object
            delete deCamelBook.updated_at;

            res.send(camelizeKeys(deCamelBook));
        })

    .catch((err) => {
        next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
    var body = req.body;
    var updateBook = {
        title: body.title,
        author: body.author,
        genre: body.genre,
        description: body.description,
        cover_url: body.coverUrl
    };

    knex('books')
        .where('id', req.params.id)
        .first()
        .then((data) => {
            if (!data) {
                return next();
            }
            return knex('books')
                .update(decamelizeKeys(updateBook), '*')
                .where('id', req.params.id);
        })
        .then((data) => {
            const deCamelBook = data[0];

            delete deCamelBook.created_at; //delete key from Object
            delete deCamelBook.updated_at;

            res.send(camelizeKeys(data[0]));
        })
        .catch((err) => {
            next(err);
        });
});

router.delete('/books/:id', function(req,res,next) {
  knex('books')
  .where({id: req.params.id})
  .first()
  .del()
  .then(function () {
    res.sendStatus(200);
  })
  .catch(function (err) {
    next(err);
  });
});

module.exports = router;
