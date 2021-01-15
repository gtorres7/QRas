const MongoClient = require('mongoose');
const prodcutos = require('../../DB/Schemas/Productos');
const uri = "mongodb+srv://gibran:Amadeus1@cluster0.7rjxk.mongodb.net/user-Registration-DB?retryWrites=true&w=majority";

const connectMongo = async () => {
   await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
   console.log("mogno conect");
}

module.exports = connectMongo;