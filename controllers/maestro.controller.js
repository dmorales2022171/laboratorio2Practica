const bcryptjs = require('bcryptjs');
const Maestro = require('../models/maestro');
const Curso = require('../models/curso')
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
    const { _id, password, cursos, ...resto } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    if (cursos) {
        try {
            const cursosEncontrados = await Curso.find({ _id: { $in: cursos } });

            if (cursosEncontrados.length !== cursos.length) {
                return res.status(400).json({ msg: 'Uno o más cursos no existen' });
            }

            resto.cursos = cursosEncontrados.map(curso => curso._id);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Error interno del servidor' });
        }
    }

    try {
        await Maestro.findByIdAndUpdate(id, resto);
        const maestro = await Maestro.findById({_id: id});
        res.status(200).json({
            msg: 'Se han realizado los cambios correctamente',
            maestro
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
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
    const { nombre, correo, password, role, cursos } = req.body;

    try {
        if (!cursos || cursos.length > 3) {
            return res.status(400).json({ msg: 'No se puede asignar más de 3 cursos' });
        }

        const cursosEncontrados = await Curso.find({ _id: { $in: cursos } });

        if (cursosEncontrados.length !== cursos.length) {
            return res.status(400).json({ msg: 'Uno o más cursos no existen' });
        }

        const maestro = new Maestro({ nombre, correo, password, role, cursos: cursosEncontrados.map(curso => curso._id) });

        const salt = bcryptjs.genSaltSync();
        maestro.password = bcryptjs.hashSync(password, salt);

        await maestro.save();

        res.status(202).json({
            maestro,
            cursos: cursosEncontrados.map(curso => ({ id: curso._id, nombre: curso.nombre }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};


module.exports = {
    maestroPost,
    maestroGet,
    getMaestroById,
    putMaestro,
    maestroDelete
}