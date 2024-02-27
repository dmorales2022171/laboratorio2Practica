const { Schema, model } = require('mongoose');

const maestroSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true,'La contraseña es obligatoria']
    },
    cursos: [{
        type: Schema.Types.ObjectId,
        ref: 'Curso'
    }],
    role:{
        type: String,
        default: "TEACHER_ROLE"
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
