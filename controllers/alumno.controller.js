const bcryptjs = require('bcryptjs');
const Alumno = require('../models/alumno');
const { response } = require('express');

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

const alumnoPost = async (req, res) =>{
    const {nombre, correo, password, role, curso} = req.body;
    const alumno = new Alumno({nombre, correo, password, role, curso});

    const salt = bcryptjs.getSaltSync();
    alumno.password = bcryptjs.hasSync(password, salt);

    await alumno.save();

    res.status(202).json({
        alumno
    });
}



module.exports = {
    alumnoGet,
    getAlumnoById,
    alumnoPost
}