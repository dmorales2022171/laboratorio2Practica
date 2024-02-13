const { Router } = require('express');
const { check } = require('express-validator')

const router = Router();

const {validarCampos} = require('../middlewares/validar-campos')

const {
    alumnoPost,
 } = require('../controllers/alumno.controller');
const { esRoleValido, existenteEmail } = require('../helpers/db-validators');



router.post(
    "/",
    [
        check("nombre", "el nombre no puede ir vacio"),
        check("password", "la password debe ser mayor a 8 digitos").isLength({ min: 6 }),
        check("correo", "Este no es un correo valido").isEmail(),
        check("correo").custom(existenteEmail),
        check("role").custom(esRoleValido),
        validarCampos,
    ], alumnoPost);

module.exports = router;