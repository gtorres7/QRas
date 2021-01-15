const express = require('express');
const mongo = require('mongoose');
const Alumnos = require('../../DB/Schemas/Alumnos');
const Aula = require('../../DB/Schemas/Aula');
const route = express.Router();

route.post('/', async(req, res)=>{
    let mensaje = "Sin Error";
    let flagAsistenciaExistente = 0;
    const {NameAlumno, LastNameAlumno, NameAula, NameMaestro, Password, Localizacion, DateAsistencia} = req.body;
    
    let aulaCheck = await Aula.findOne({
        Name:NameAula,
        NameMaestro:NameMaestro
    });
    let timepoInicio = DateAsistencia;

    if(aulaCheck == null){
        mensaje = "No se encontro Aula";
    }
    else{
        if(aulaCheck.Asistencia == null || aulaCheck.Asistencia == 0){
            if(aulaCheck.Password == Password){
                await Aula.findOneAndUpdate(
                    {
                        Name:NameAula,
                        NameMaestro:NameMaestro
                    },
                    {
                        Asistencia:[{
                            NameAlumno:NameAlumno,
                            LastNameAlumno:LastNameAlumno,
                            Localizacion:Localizacion,
                            DateAsistencia:DateAsistencia
                        }]
                    }
                );
                mensaje = "Datos guardados";
            }
            else{
                mensaje = "Password de la Clase Incorrecto";
            }
            
        }
        else{
            for(let i = 0; i < aulaCheck.Asistencia.length; i++){
                if(aulaCheck.Asistencia[i].NameAlumno == NameAlumno && aulaCheck.Asistencia[i].LastNameAlumno == LastNameAlumno){
                    flagAsistenciaExistente = 1;
                }
            }
            if(flagAsistenciaExistente == 1){
                mensaje = "Asistencia Existente";
            }
            else{
                if(aulaCheck.Password == Password){
                    let datosAlumnos = aulaCheck.Asistencia;
                    datosAlumnos.push({
                        NameAlumno:NameAlumno,
                        LastNameAlumno:LastNameAlumno,
                        Localizacion:Localizacion,
                        DateAsistencia:DateAsistencia
                    });

                    await Aula.findOneAndUpdate(
                        {
                            Name:NameAula,
                            NameMaestro:NameMaestro
                        },
                        {
                            Asistencia:datosAlumnos
                        }
                    );
                    mensaje = "Datos guardados";
                }
                else{
                    mensaje = "Password de la Clase Incorrecto";
                }
            }
        }
    }
    res.send(mensaje);
});

module.exports = route;