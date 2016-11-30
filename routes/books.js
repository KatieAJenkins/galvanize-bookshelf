'use strict';

const express = require('express');
const knex = require('../knex');
const {
    camelizeKeys,
    deCamelizeKeys
} = require('humps');
// eslint-disable-next-line new-cap
const router = express.Router();


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

// TO DO //
router.post('/books', (req, res, next) => {
    knex('books')
      .insert({
        title: req.body.name,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.cover_url,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at
      }, '*')

      .then((books) => {
        const booksCamel = camelizeKeys(books);
        res.send(booksCamel[0]);
      })
      .catch((err) => {
        next(err);
      });
    });
//
// router.patch('/books/:id' , (req, res, next) => {
//   knex('books')
//     .where('id', req.params.id)
//     .first()
//     .then((book) => {
//       if (!book) {
//         return next();
//       }
//
//       return knex('books')
//         .update({
//           title: req.body.name
//         }, '*')
//         .where('id' , req.params.id);
//       })
//       .then((books) => {
//         res.send(books[0]);
//       })
//       .catch((err) => {
//         next(err);
//       });
//     });
//
// router.delete('/books/:id') , (req, res, next) => {
//   let books;
//
//   knex('books')
//     .where('id' , req.params.id)
//     .first()
//     .then((row) => {
//       if(!row) {
//         return next();
//       }
//
//       var book = row;
//
//       return knex('book')
//         .del()
//         .where('id' , req.params.id);
//     })
//     .then(() => {
//       delete book.id;
//       res.send(book);
//     })
//
//     .catch((err) => {
//       next(err);
//     });
//   };

module.exports = router;
