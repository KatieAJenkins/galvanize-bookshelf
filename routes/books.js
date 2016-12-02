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

    //TO DO -- ERROR CHECKING//
    // if (!name || !name.trim()) {
    //     // res.status(400).send("Name must not be blank.")
    //     next(boom.create(400, 'Name must not be blank.'));
    //     return;
    //   }

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
