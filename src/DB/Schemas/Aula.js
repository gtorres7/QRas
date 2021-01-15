
const mongoose = require('mongoose');
const { Schema } = mongoose;

const AulaSchema = new mongoose.Schema({
    Name:String,
    NameMaestro:String,
    QR:String,
    Password:String,
    TiempoExpiracion: Number,
    FechaCreacion:String,
    Asistencia: [
        {
            NameAlumno:String,
            LastNameAlumno:String,
            Localizacion:String,
            DateAsistencia:String
        }
    ]
});

module.exports = AulaModel = mongoose.model('AulaModel', AulaSchema);