'use strict';

const express = require('express');
const knex = require('../knex');
const {camelizeKeys , deCamelizeKeys} = require ('humps');
// eslint-disable-next-line new-cap
const router = express.Router();


router.get('/books', (req, res, next) => {
  knex('books')
  .orderBy('id')
  .then((books) => {
    const booksCamel = camelizeKeys(books);
    res.send(booksCamel);
  })
  .catch((err) => {
    next(err);
  });
});

router.get('/books/:id' , (req, res, next) => {
  knex('books')
  .where('id', req.params.id)
  .first()
  .then((book) => {
    if (!book) {
      return next();
    }

    res.send(book);
})
  .catch((err) => {
    next(err);
  });
});


module.exports = router;
