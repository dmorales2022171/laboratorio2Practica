const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { alumnoPost, putAlumno, getAlumnoById, alumnoGet, alumnoDelete } = require('../controllers/alumno.controller');
const { esRoleValido, existenteEmail, existeAlumnoById } = require('../helpers/db-validators');

const router = Router();

router.get("/", alumnoGet);

router.get(
    "/:id",
    [
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom(existeAlumnoById),
        validarCampos
    ], getAlumnoById
);



router.put(
    "/:id",
    [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existeAlumnoById),
        check("correo", "Este no es un correo valido").isEmail(),
        check("correo").custom(existenteEmail),
        check("role").custom(esRoleValido),
        validarCampos
    ], putAlumno
);

router.post(
    "/",
    [
        check("nombre", "el nombre no puede ir vacio"),
        check("password", "la password debe ser mayor a 8 digitos").isLength({ min: 6 }),
        check("correo", "Este no es un correo valido").isEmail(),
        check("correo").custom(existenteEmail),
        check("role").custom(esRoleValido),
        validarCampos,
    ], alumnoPost
);

router.delete(
    "/:id",
    [
        check("id", "No es un id valido").isMongoId(),
        check('id').custom(existeAlumnoById),
        validarCampos
    ], alumnoDelete
);
module.exports = router; 