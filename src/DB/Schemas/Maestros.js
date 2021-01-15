const mongoose = require('mongoose');
const { Schema } = mongoose;

const MaestrosSchema = new mongoose.Schema({
    Name:String,
    LastName:String,
    Email:String,
    Password:String
});

module.exports = MaestrosModel = mongoose.model('MaestrosModel', MaestrosSchema);