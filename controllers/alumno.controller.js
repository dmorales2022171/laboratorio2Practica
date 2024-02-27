const bcryptjs = require('bcryptjs');
const Alumno = require('../models/alumno');
const Curso = require('../models/curso');
const { response } = require('express');
const { validationResult } = require('express-validator');

const alumnoGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const [total, maestros] = await Promise.all([
            Alumno.countDocuments(query),
            Alumno.find(query)
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

const getAlumnoById = async (req, res) => {
    const { id } = req.params;

    try {
        const alumno = await Alumno.findOne({ _id: id })
            .populate('cursos');

        if (!alumno) {
            return res.status(404).json({ msg: 'Alumno no encontrado' });
        }

        res.status(200).json({
            alumno
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
}
const putAlumno = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, ...resto } = req.body; 

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    await Alumno.findByIdAndUpdate(id, resto);

    const alumno = await Alumno.findOne({ _id: id }); 

    res.status(200).json({
        msg: 'Se actualizó su perfil',
        alumno
    });
}

const alumnoDelete = async (req, res) =>{
    const {id} = req.params;
    const alumno = await Alumno.findByIdAndUpdate(id, {estado: false}); 
    const alumnoAutenticado = req.alumno;

    res.status(200).json({
        msg: 'se elimino su perfil',
        alumno,
        alumnoAutenticado
    });
}



const alumnoPost = async (req, res) => {
    const { nombre, correo, password, cursos } = req.body;

    try {
        if (cursos && cursos.length > 3) {
            return res.status(400).json({ msg: 'No se puede inscribir en más de 3 cursos' });
        }

        if (cursos && new Set(cursos).size !== cursos.length) {
            return res.status(400).json({ msg: 'No se puede inscribir en el mismo curso varias veces' });
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

        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const alumno = new Alumno({ nombre, correo, password: hashedPassword, cursos: cursosIds });
        await alumno.save();

        res.status(202).json({ alumno, cursosAsignados: cursosNombres });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};







module.exports = {
    alumnoGet,
    getAlumnoById,
    alumnoPost,
    putAlumno,
    alumnoDelete
}