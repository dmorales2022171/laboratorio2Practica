const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { cursoPost, cursoGet, getCursoById, putCurso, cursoDelete } = require('../controllers/curso.controller');
const { existeCursoById } = require('../helpers/db-validators');

const router = Router();

router.get("/", cursoGet);

router.get(
    "/:id",
    [
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom(existeCursoById),
        validarCampos
    ], getCursoById
);

router.put(
    "/:id",
    [
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom(existeCursoById),
        validarCampos
    ], putCurso
)

router.post(
    "/",
    [
        check("nombre", "el nombre del curso no debe ir vacío").not().isEmpty(),
        check("descripcion", "la descripción del curso no debe ir vacía").not().isEmpty(),
        validarCampos
    ],
    cursoPost
);

router.delete(
    "/:id",
    [
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom(existeCursoById),
        validarCampos
    ], cursoDelete
)

module.exports = router;
