const express = require('express');
const mongo = require('mongoose');
const route = express.Router();

route.get('/', async(req, res)=>{
    res.render('home');
});

module.exports = route;