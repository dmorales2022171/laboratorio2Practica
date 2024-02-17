const bcryptjs = require('bcryptjs');
const Maestro = require('../models/maestro');
const { response } = require('express');

const maestroGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, maestros] = await Promise.all([
        Maestro.countDocuments(query),
        Maestro.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        maestros
    })
}

const getMaestroById = async (req, res) => {
    const { id } = req.params;
    const maestro = await Maestro.findOne({ _id: id });

    res.status(200).json({
        maestro
    })
}

const putMaestro = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, ...resto } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    await Maestro.findByIdAndUpdate(id, resto);

    const maestro = await Maestro.findOne({ _id: id });

    res.status(200).json({
        msg: 'se hizo cambios',
        maestro
    });
}

const maestroDelete = async (req, res) => {
    const { id } = req.params;
    const maestro = await Maestro.findByIdAndUpdate(id, { estado: false });
    const maestroAutenticado = req.maestro;

    res.status(200).json({
        msg: 'maestro eliminado',
        maestro,
        maestroAutenticado
    });
}

const maestroPost = async (req, res) => {
    const { nombre, correo, password, curso, role } = req.body;
    const maestro = new Maestro({ nombre, correo, password, curso, role });

    const salt = bcryptjs.genSaltSync();
    maestro.password = bcryptjs.hashSync(password, salt);

    await maestro.save();
    res.status(202).json({
        maestro
    });
}

module.exports = {
    maestroPost,
    maestroGet,
    getMaestroById,
    putMaestro,
    maestroDelete
}