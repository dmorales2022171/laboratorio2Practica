const { Schema, model } = require('mongoose');

const cursoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre del curso es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'la descripcion es obligatoria']
    },
    maestro: {
        type: Schema.Types.ObjectId,
        ref: 'Maestro',
        required: [true, 'el profesor es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Curso', cursoSchema);
