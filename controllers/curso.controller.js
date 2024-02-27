const Curso = require('../models/curso');
const Alumno = require('../models/alumno');
const Maestro = require('../models/maestro')
const { response } = require('express');
const mongoose = require('mongoose');

const cursoGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, cursos] = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.status(200).json({
        total,
        cursos
    })
}

const getCursoById = async (req, res) => {
    const { id } = req.params;
    const curso = await Curso.findOne({ _id: id });

    res.status(200).json({
        curso
    })
}

const putCurso = async (req, res = response) => {
    const { id } = req.params;
    const { nombre, descripcion, maestro } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(maestro)) {
            return res.status(400).json({ msg: `El ID del maestro '${maestro}' no es válido` });
        }

        const curso = await Curso.findByIdAndUpdate(id, { nombre, descripcion, maestro }, { new: true });

        if (!curso) {
            return res.status(404).json({ msg: 'Curso no encontrado' });
        }

        res.status(200).json({ msg: 'Curso actualizado correctamente', curso });
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ msg: 'Error de casting: los valores proporcionados no son válidos' });
        }
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};
const cursoDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const curso = await Curso.findByIdAndDelete(id);

        if (!curso) {
            return res.status(404).json({ msg: 'Curso no encontrado' });
        }

        await Alumno.updateMany({ cursos: curso._id }, { $pull: { cursos: curso._id } });
        await Maestro.updateMany({ cursos: curso._id }, { $pull: { cursos: curso._id } });

        res.status(200).json({ msg: 'Curso eliminado correctamente', curso });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};


const cursoPost = async (req, res) => {
    const { nombre, descripcion, } = req.body;
    const curso = new Curso({ nombre, descripcion});

    await curso.save();
    res.status(202).json({
        curso
    });
};

module.exports = {
    cursoPost,
    cursoGet,
    getCursoById,
    putCurso,
    cursoDelete
};
