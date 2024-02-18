const Curso = require('../models/curso');
const { response } = require('express');

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
    const { nombre, descripcion } = req.body;

    const curso = await Curso.findByIdAndUpdate(id, { nombre, descripcion });

    res.status(200).json({
        msg: 'Se actualizó el curso',
        curso
    });
}

const cursoDelete = async (req, res) => {
    const { id } = req.params;
    const curso = await Curso.findByIdAndUpdate(id, { estado: false });
    const cursoAutenicado = req.curso;

    res.status(200).json({
        msg: 'curso eliminado',
        curso,
        cursoAutenicado
    })
}

const cursoPost = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const curso = new Curso({ nombre, descripcion });

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
