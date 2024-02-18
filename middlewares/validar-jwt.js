const jwt = require('jsonwebtoken');
const Maestro = require('../models/maestro');
const Alumno = require('../models/alumno');
const { request, response } = require('express');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(400).json({
            msg: 'no hay token en la petición',
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        let usuario = await Maestro.findById(uid);

        if (!usuario) {
            usuario = await Alumno.findById(uid);
            if (!usuario) {
                return res.status(401).json({
                    msg: "el usuario no existe en la base de datos",
                    usuario
                });
            }
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: "el usuario está deshabilitado"
            });
        }

        req.usuario = usuario;
        next();

    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: 'token no válido'
        });
    }
};

module.exports = {
    validarJWT
};
