const { response } = require("express");


const esMaestroRole = (req, res, next) => {
    if (!req.maestro) {
        return res.status(500).json({
            msg: "se desea validar un maestro sin validar el token"
        })
    }

    const { role, nombre } = req.maestro;

    if (role !== "TEACHER_ROLE") {
        return res.status(401).json({
            msg: `${nombre} no es un TEACHER_ROLE, no puede usar usted este endpoint`
        })
    }
    next();
}

const esAlumnoRole = (req, res, next) => {
    if (!req.alumno){
        return res.status(500).json({
            msg: "se desea validar el alumno sin validar el token"
        });
    }

    const {role, nombre} = req.alumno;

    if(role !== "STUDENT_ROLE"){
        return res.status(401).json({
            msg: `${nombre} no es un STUDENT_ROLE, no puede usar usted este endpoint`
        })
    }
    next();
}

const tieneRoleAutorizado = (...roles) =>{
    return (req = request, res = response, next) =>{

        if(!req.usuario){
            return res.status(500).json({
                msg: "se desea validar un usuario sin validar el token"
            });
        }
    
        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                msg: `El servicio requiere una de las siguientes roles autorizados ${roles}`
            })
        }
        next();
    }
}

module.exports = {
    esMaestroRole,
    esAlumnoRole,
    tieneRoleAutorizado
}