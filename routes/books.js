'use strict';

const express = require('express');
const knex = require('../knex');
const {camelizeKeys,decamelizeKeys} = require('humps');
// eslint-disable-next-line new-cap
const router = express.Router();
const boom = require('boom');
// const bodyParser = require('bodyParser');

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
// // parse application/json
// app.use(bodyParser.json());

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
  // const {title, author, genre, description, cover_url} = req.body;
  var body = req.body;
  var newBook = {
    title: body.title,
    author: body.author,
    genre: body.genre,
    description: body.description,
    cover_url: body.coverUrl
  };

console.log(newBook);



  // if (!name || !name.trim()) {
  //     // res.status(400).send("Name must not be blank.")
  //     next(boom.create(400, 'Name must not be blank.'));
  //     return;
  //   }
  //


    knex('books')
      .insert(decamelizeKeys(newBook), "*")
      .then((data) => { //data = the object that comes back
        const bookCamel = data[0]; //finding object in array
        // console.log("***********");
        // console.log(bookCamel);
        // console.log("***********");

        delete bookCamel.created_at; //delete key from Object
        delete bookCamel.updated_at;

        res.send(camelizeKeys(bookCamel));
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
