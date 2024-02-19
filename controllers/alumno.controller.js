const bcryptjs = require('bcryptjs');
const Alumno = require('../models/alumno');
const Curso = require('../models/curso');
const { response } = require('express');
const { validationResult } = require('express-validator');

const alumnoGet = async  (req, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, alumnos] = await Promise.all([
        Alumno.countDocuments(query),
        Alumno.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        alumnos
    })
}

const getAlumnoById = async (req, res) =>{
    const {id} = req.params;
    const alumno = await Alumno.findOne({_id : id});

    res.status(200).json({
        alumno
    });
}

const putAlumno = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, ...resto } = req.body; // Asegúrate de incluir password aquí

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    await Alumno.findByIdAndUpdate(id, resto);

    const alumno = await Alumno.findOne({ _id: id }); // Cambia id por _id

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
    const { nombre, correo, password, role, cursos } = req.body;

    try {
        if (cursos.length > 3) {
            return res.status(400).json({ msg: 'No se puede inscribir en más de 3 cursos' });
        }
        const cursosUnicos = [...new Set(cursos)]; 
        if (cursos.length !== cursosUnicos.length) {
            return res.status(400).json({ msg: 'No se puede inscribir en el mismo curso varias veces' });
        }
        const alumno = new Alumno({ nombre, correo, password, role, cursos });
        await alumno.save();
        const cursosAlumno = await Curso.find({ _id: { $in: cursos } }, 'nombre');
        res.status(202).json({
            alumno,
            cursos: cursosAlumno.map(curso => curso.nombre)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
}




module.exports = {
    alumnoGet,
    getAlumnoById,
    alumnoPost,
    putAlumno,
    alumnoDelete
}