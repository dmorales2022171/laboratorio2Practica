const { request, response } = require("express");
const Maestro = require("../models/maestro");
const Alumno = require("../models/alumno");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;

    try {

        let usuario = await Maestro.findOne({ correo });
        let tipoUsuario = 'profesor'; 
        

        if (!usuario) {
            usuario = await Alumno.findOne({ correo });
            tipoUsuario = 'alumno'; 
        }


        if (!usuario) {
            return res.status(400).json({
                msg: "Credenciales incorrectas, correo no existe en la base de datos"
            });
        }

        if (!usuario.estado) {
            return res.status(400).json({
                msg: "El usuario no está activo en la base de datos"
            });
        }

        const validarPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validarPassword) {
            return res.status(400).json({
                msg: "La contraseña es incorrecta"
            });
        }
        const token = await generarJWT (usuario.id);
        res.status(200).json({
            msg: `Bienvenido ${tipoUsuario} ${usuario.nombre}`,
            token
        });




    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Comuníquese con el administrador"
        });
    }
}

module.exports = {
    login,
}
