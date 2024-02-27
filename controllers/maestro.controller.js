const bcryptjs = require('bcryptjs');
const Maestro = require('../models/maestro');
const Curso = require('../models/curso')
const { response } = require('express');

const maestroGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const [total, maestros] = await Promise.all([
            Maestro.countDocuments(query),
            Maestro.find(query)
                .populate('cursos')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            maestros
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
}

const getMaestroById = async (req, res) => {
    const { id } = req.params;

    try {
        const maestro = await Maestro.findOne({ _id: id })
            .populate('cursos');

        if (!maestro) {
            return res.status(404).json({ msg: 'Maestro no encontrado' });
        }

        res.status(200).json({
            maestro
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
}


const putMaestro = async (req, res = response) => {
    const { id } = req.params;
    const { password, cursos, ...resto } = req.body;

    try {
        if (password) {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }

        if (cursos) {
            const cursosEncontrados = await Curso.find({ nombre: { $in: cursos } });

            if (cursosEncontrados.length !== cursos.length) {
                return res.status(400).json({ msg: 'Uno o más cursos no existen' });
            }

            resto.cursos = cursosEncontrados.map(curso => curso._id);
        }

        await Maestro.findByIdAndUpdate(id, resto);
        const maestro = await Maestro.findById(id).populate('cursos', 'nombre');

        const cursosActualizados = maestro.cursos.map(curso => curso.nombre);

        res.status(200).json({
            msg: 'Se han realizado los cambios correctamente',
            maestro,
            cursosActualizados
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};



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
    const { nombre, correo, password,cursos } = req.body;

    try {
        if (cursos && cursos.length > 3) {
            return res.status(400).json({ msg: 'No se puede asignar más de 3 cursos' });
        }

        const correoExistente = await Maestro.findOne({ correo });
        if (correoExistente) {
            return res.status(400).json({ msg: 'El correo ya está en uso' });
        }

        if (cursos && new Set(cursos).size !== cursos.length) {
            return res.status(400).json({ msg: 'Un maestro no puede ser asignado al mismo' });
        }

        const cursosIds = [];
        const cursosNombres = [];
        if (cursos) {
            for (const cursoNombre of cursos) {
                const curso = await Curso.findOne({ nombre: cursoNombre });
                if (!curso) {
                    return res.status(400).json({ msg: `El curso '${cursoNombre}' no existe` });
                }
                cursosIds.push(curso._id);
                cursosNombres.push(curso.nombre);
            }
        }

        const maestro = new Maestro({ nombre, correo, password, cursos: cursosIds });

        const salt = bcryptjs.genSaltSync();
        maestro.password = bcryptjs.hashSync(password, salt);

        await maestro.save();

        res.status(202).json({ maestro, cursosAsignados: cursosNombres });
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