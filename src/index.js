const express = require('express');
const app = express();
const engine = require('ejs-mate');
const path = require('path');
var server = require('http').createServer(app);
var session = require('express-session');

const MongoClient = require('mongoose');
const uri = "mongodb+srv://gibran:Amadeus1@cluster0.7rjxk.mongodb.net/user-Registration-DB?retryWrites=true&w=majority";


const connectMongo = async () => {
   await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
   console.log("mogno conect");
}

connectMongo();

app.set('views',path.join(__dirname,'views'));
app.engine('ejs',engine);
app.set('view engine','ejs');
app.use('/public',express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(session({
    secret: "Api_Asistencias",
    resave: true,
    saveUninitialized: false
}));

app.use('/GenerarQR', require('./route/API_Asistens/QR_Generator'));
app.use('/Usuario', require('./route/API_Asistens/Alumos'));
app.use('/Maestro', require('./route/API_Asistens/Maestros'));
app.use('/Asistencia', require('./route/API_Asistens/Asistencia'));
app.use('/', require('./route/API_Asistens/Home'));

const port = process.env.port || 3000;
// process.env.PORT, '0.0.0.0'
server.listen(process.env.PORT, '0.0.0.0', function (){
    console.log("Started");
});