const express = require('express');
const mongo = require('mongoose');
const Maestro = require('../../DB/Schemas/Maestros');
const Aula = require('../../DB/Schemas/Aula');
const qrcode = require("qrcode");
const route = express.Router();
let url = "https://appasisten.herokuapp.com/";

route.get('/home', async(req, res)=>{
    if(req.session.Maestro != null){
        let Aulas = await Aula.find({
            NameMaestro: req.session.Maestro.Name
        });
        res.render('homeMaestros',
        {
            Aulas:Aulas,
            NameMaestro: req.session.Maestro.Name
        });
    }
    else{
        res.render('loginMaestros');
    }
  
});

route.get('/sigin', async(req, res)=>{
    res.render('siginMaestros');
});

route.post('/sigin', async(req, res)=>{
    const {Name, LastName, Email, Password} = req.body;
    
    let check = await Maestro.findOne({Email:Email, Password:Password});
    if(check == null){
        let maestroDomain = new Maestro();
    
        maestroDomain.Name = Name;
        maestroDomain.LastName = LastName;
        maestroDomain.Email = Email;
        maestroDomain.Password = Password;
        
        await maestroDomain.save();  
        res.send("Correcto");  
    }
    else{
        res.send("Existente");
    }
});

route.get('/login', async(req, res)=>{
    res.render('loginMaestros');
});

route.post('/login', async(req, res)=>{
    const {Email, Password} = req.body;
    let maestroDomain = await Maestro.find({Email:Email, Password:Password});
    if(maestroDomain.length == 1){
        req.session.Maestro = {Name: maestroDomain[0].Name};
        res.send('/Maestro/home');
    }
    else{
        res.send('Usuario o Contraseña incorrecto');
    }
});

route.post('/Generar', async(req, res)=>{
    let Mensaje = "";
    const {Name, NameMaestro, Password, TiempoExpiracion} = req.body;

    let Aulas = await Aula.find({ Name:Name });

    if(Aulas.length != "" || Aulas.length == 1){
        Mensaje = "Se encontro una ya existente";
    }
    else{
        let time = Date.now();
      
        let CreateAula = new Aula(); 
        CreateAula.Name = Name;
        CreateAula.NameMaestro = NameMaestro;
        CreateAula.Password = Password;
        CreateAula.TiempoExpiracion = TiempoExpiracion;
        CreateAula.FechaCreacion = Date(time);
        CreateAula.Asistencia = [];
        let datosQR =  `
            {
                "Name":"${Name}",
                "NameMaestro":"${NameMaestro}",
                "Url":"${url}"
            }
        `;
        const QR = await qrcode.toDataURL(datosQR);
        CreateAula.QR = QR;
        await CreateAula.save();
        Mensaje = "Datos Guardados";
    }

    if(Mensaje == ""){
        res.send(Aulas);
    }
    else{
        res.send(Mensaje);
    }
});


route.get('/All', async(req, res)=>{
    let Alumnos  = await Aula.find();
    let Mensaje = "";
    if(Alumnos == "" || Alumnos.length == 0){
        Mensaje = "No se encontro registro";
        res.json(Mensaje);
    }
    else{
        res.json(Alumnos);
    }
});

route.get('/:Name',async(req, res)=>{
    let NameId = req.params.Name;
    let Mensaje;
    let aulaDomain = await Aula.find({Name:NameId});
    
    if(aulaDomain.length != 0){
        res.json(aulaDomain);
    }
    else{
        Mensaje = "No se encontro registro";
        res.json(Mensaje);
    }
});

route.put('/:Name',async(req, res)=>{
    let NameId = req.params.Name;
    const {Name, Password, TiempoExpiracion, FechaCreacion} = req.body;

    let aulaDomain = await Aula.findOneAndUpdate(
        {Name:NameId},
        {
           Name: Name,
           Password: Password,
           TiempoExpiracion: TiempoExpiracion,
           FechaCreacion: FechaCreacion
        }
    );
    res.json(aulaDomain);
});

route.delete('/:Name',async(req, res)=>{
    let NameS = req.params.Name;
    let mensaje
    try{
        await Aula.findOneAndDelete({Name:NameS});
        mensaje ="delete complete";
    }
    catch{
        mensaje = "id invalid";
    }
    res.json(mensaje);
});


module.exports = route;