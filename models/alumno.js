const { Schema, model } = require('mongoose');

const AlumnoSchema = Schema({
    nombre: {
        type: String, 
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role:{
        type: String,
        required: true,
        enum: ["STUDENT_ROLE"]
    },
    cursos: [{
        type: Schema.Types.ObjectId,
        ref: 'Curso'
    }],
    estado:{
        type: Boolean,
        default: true
    }
});

module.exports = model('Alumno', AlumnoSchema);
