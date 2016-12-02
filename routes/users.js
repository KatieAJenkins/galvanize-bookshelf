'use strict';

const express = require('express');
const knex = require('../knex');
const {
    camelizeKeys,
    decamelizeKeys
} = require('humps');

const router = express.Router();
const boom = require('boom');

router.post('/users', (req, res, next) => {
    var body = req.body;
    var newUser = {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        hashed_password: body.hashed_password,
    };

    //TO DO -- ERROR CHECKING//
    // if (!name || !name.trim()) {
    //     // res.status(400).send("Name must not be blank.")
    //     next(boom.create(400, 'Name must not be blank.'));
    //     return;
    //   }

    knex('users')
        .insert(decamelizeKeys(newUser), "*")
        .then((data) => { //data = the object that comes back
            const deCamelUser = data[0]; //finding object in array

            delete deCamelUser.created_at; //delete key from Object
            delete deCamelUser.updated_at;

            res.send(camelizeKeys(deCamelUser));
        })

    .catch((err) => {
        next(err);
    });
});

module.exports = router;
