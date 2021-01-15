const express = require('express');
const app = express();
const mongo = require('mongoose');
const Alumno = require('../../DB/Schemas/Alumnos');
const route = express.Router();

route.get('/home', async(req, res)=>{
    if(req.session.Alumno != null){
        res.render('homeAlumnos',
        {
            Usuario:req.session.Alumno
        }
        );
    }
    else{
        res.redirect('/Usuario/login');
    }
});

route.get('/sigin', async(req, res)=>{
    res.render('siginAlumnos');
});

route.post('/sigin', async(req, res)=>{
    const {Name, LastName, Email, Password} = req.body;
    
    let check = await Alumno.findOne({Email:Email, Password:Password});
    if(check == null){
        let alumnoDomain = new Alumno();
    
        alumnoDomain.Name = Name;
        alumnoDomain.LastName = LastName;
        alumnoDomain.Email = Email;
        alumnoDomain.Password = Password;
        
        await alumnoDomain.save();  
        res.send("Correcto");  
    }
    else{
        res.send("Existente");
    }
});

route.get('/login', async(req, res)=>{
    res.render('loginAlumnos');
});

route.post('/login', async(req, res)=>{
    const {Email, Password} = req.body;
    let alumnoDomain = await Alumno.find({Email:Email, Password:Password});

    if(alumnoDomain.length == 1){
        req.session.Alumno = {Name: alumnoDomain[0].Name, LastName: alumnoDomain[0].LastName};

        res.send('/Usuario/home');
    }
    else{
        req.session.Alumno = {};
        res.send('Usuario o Contraseña incorrecto');
    }
});

module.exports = route;