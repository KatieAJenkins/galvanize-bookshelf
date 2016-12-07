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

router.get('/token', (req, res, next) => {
    knex('tokens')
        .then((tokens) => {
            const tokenCamel = camelizeKeys(tokens);
            res.send(tokenCamel);
        })
        .catch((err) => {
            next(err);
        });
});

// router.post('/token', (req, res, next) => {
//     var body = req.body;
//     var newUser = {
//         first_name: body.first_name,
//         last_name: body.last_name,
//         email: body.email,
//         hashed_password: body.hashed_password,
//     };
//
//TODO Error Checking
//
//     knex('token')
//         .insert(decamelizeKeys(newUser), "*")
//         .then((data) => { //data = the object that comes back
//             const deCamelUser = data[0]; //finding object in array
//
//             delete deCamelUser.created_at; //delete key from Object
//             delete deCamelUser.updated_at;
//
//             res.send(camelizeKeys(deCamelUser));
//         })
//
//     .catch((err) => {
//         next(err);
//     });
// });

module.exports = router;
