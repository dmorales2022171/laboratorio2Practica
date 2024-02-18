const { Schema , model } = require('mongoose');

const cursoSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'el nombre del curso es obligatorio']
    },
    descripcion: {
        type: String,
        requierd: [true, 'la descripcion es obligatoria']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = model ('Curso', cursoSchema);