const Role = require('../models/role');
const Alumno = require('../models/alumno');

const esRoleValido = async (role = '') =>{
    const existeRol = await Role.findOne({role});
    if(!existeRol){
        throw new Error(`El role ${ role } no existe el rol en la base de datos`);
    }
}

const existenteEmail = async (correo = '')=>{
    const existenteEmail = await  Alumno.findOne({ correo });
    if(existenteEmail) {
        throw new Error (`El correo ${correo} ya esta registrado`);
    }
}

const existeAlumnoById = async (id = '') => {
    const existeAlumno = await Alumno.findOne({id});
    if(existeAlumno){
        throw new Error(`el usuario con el ${id} no existe en la base de datos`);
    }
}

module.exports = {
    esRoleValido,
    existenteEmail,
    existeAlumnoById
}