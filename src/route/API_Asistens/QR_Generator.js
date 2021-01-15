const express = require('express');
const mongo = require('mongoose');
const Aula = require('../../DB/Schemas/Aula');
const route = express.Router();
const qrcode = require("qrcode");
let url = "http://127.0.0.1:3000/";

route.get('/home', async(req, res)=>{
    let Aulas = await Aula.find();
    res.render('homeMaestros',{
        Aulas:Aulas
    });
    
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