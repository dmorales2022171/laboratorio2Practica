const {Schema, model} = require('mongoose');

const maestroSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'el nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, 'el correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true,'la contraseña es obligatoria']
    },
    curso:{
       // type: Schema.Types.ObjectId,  //referencia a un documento de otro schema (curso)
        //ref: "Curso"                   //nombre del schema al que se hace refer
        type: String,
        required: [true, 'el curso es obligatorio']
    },
    role:{
        type: String,
        require: true,
        enum: ["TEACHER_ROLE"]
    },
    estado:{
        type: Boolean,
        default: true
    }

    
});

module.exports = model ('Maestro', maestroSchema );