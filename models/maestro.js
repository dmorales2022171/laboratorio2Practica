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

maestroSchema.methods.toJSON = function(){
    const {__v, password, _id, ...maestro} = this.toObject();
    maestro.mid = _id;
    return maestro;
};

module.exports = model ('Maestro', maestroSchema );