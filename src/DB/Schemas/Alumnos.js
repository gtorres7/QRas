const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlumnosSchema = new mongoose.Schema({
    Name:String,
    LastName:String,
    Email:String,
    Password:String
});

module.exports = AlumnosModel = mongoose.model('AlumnosModel', AlumnosSchema);