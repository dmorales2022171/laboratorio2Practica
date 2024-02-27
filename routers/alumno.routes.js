const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')

const { alumnoPost, putAlumno, getAlumnoById, alumnoGet, alumnoDelete } = require('../controllers/alumno.controller');
const { esRoleValido, existenteEmail, existeAlumnoById } = require('../helpers/db-validators');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRoleAutorizado } = require('../middlewares/validar-roles');

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
        validarJWT,
        tieneRoleAutorizado('STUDENT_ROLE'),
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existeAlumnoById),
        check("correo", "Este no es un correo valido").isEmail(),
        check("correo").custom(existenteEmail),
        validarCampos
    ], putAlumno
);


router.post(
    "/",
    [
        check("nombre", "El nombre no puede estar vacío").not().isEmpty(),
        check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
        check("correo", "Correo no válido").isEmail(),
        check("cursos", "El campo 'cursos' debe ser un arreglo de IDs").isArray(), 
        validarCampos
    ],
    alumnoPost
);


router.delete(
    "/:id",
    [
        validarJWT,
        tieneRoleAutorizado('STUDENT_ROLE'),
        check("id", "No es un id valido").isMongoId(),
        check('id').custom(existeAlumnoById),
        validarCampos
    ], alumnoDelete
);
module.exports = router; 