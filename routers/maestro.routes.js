const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { existenteEmail, existeMaestroById, esRoleValido } = require('../helpers/db-validators');
const { maestroPost, maestroGet, getMaestroById, putMaestro, maestroDelete } = require('../controllers/maestro.controller');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRoleAutorizado } = require('../middlewares/validar-roles');

const router = Router();

router.get("/", maestroGet);

router.get(
    "/:id", 
    [
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom(existeMaestroById),
        validarCampos
    ],getMaestroById
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRoleAutorizado('TEACHER_ROLE'),
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existeMaestroById),
        check("correo", "Este no es un correo valido").isEmail(),
        check("correo").custom(existenteEmail),
        check("role").custom(esRoleValido),
        validarCampos
    ], putMaestro
);

router.post(
    "/",
    [
        check("nombre", "El nombre del maestro no debe ir vacio").not().isEmpty(),
        check("password", "El password debe ser mayor de 6 caracteres ").isLength({ min: 6 }),
        check("correo", "Correo electronico invalido").isEmail(),
        check("correo").custom(existenteEmail),
        check("role").custom(esRoleValido),
        validarCampos,
    ], maestroPost
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRoleAutorizado('TEACHER_ROLE'),
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom(existeMaestroById),
        validarCampos
    ], maestroDelete
);

module.exports = router;