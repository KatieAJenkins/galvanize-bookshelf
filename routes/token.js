'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const {camelizeKeys , decamelizeKeys} = require('humps');
const boom = require('boom');

//to encrypt passwords
const bcrypt = require('bcrypt-as-promised');

//to create token
const jwt = require('jsonwebtoken');

router.get('/token' , (req, res) => {
  var token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.send(false);
    }

    res.send(true);
  });
});

router.post('/token', (req, res, next) => {
    var body = req.body;
    var newUser = {
        email: body.email,
        hashed_password: body.hashed_password,
    };

  if(!newUser.email || !newUser.email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if(!newUser.hashed_password || newUser.hashed_password.length < 8) {
    return next(boom.create(400, 'Bad email or password'));
  }

    let user;

    knex('users')
        .where('email' , newUser.email)
        .first()
        .then((row) => {
          if(!row) {
            throw boom.create(400, 'Bad email or password');
          }

          user = camelizeKeys(row);

          return bcrypt.compare(newUser.hashed_password, user.hashedPassword);
        })
      .then(() => {
        delete user.hashed_password;

        var expiry = new Date (Date.now () + 1000 * 60 * 60 * 3); //3 hours
        var token = jwt.sign({userID: user.id}, process.env.JWT_SECRET, {
          expiresIn: '3h'
        });
        console.log(tokenp);

        res.cookie('token', token, { //json header field
          httpOnly: true,
          expires: expiry,
          secure: router.get('env') === 'production'
        });

        res.send(user);
      })

      .catch(bcrypt.MISMATCH_ERROR, () => {
        throw boom.create(400, 'Bad email or password'); //bad email or password
      })

      .catch((err) => {
        next(err);
      });
    });

router.delete('/token' , (req, res) => {
  res.clearCookie('token');
  res.send(true);
});

module.exports = router;
