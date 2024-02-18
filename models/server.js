const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../db/config');

class Server{
    constructor(){
        this.app = express();
        this.port  = process.env.PORT;
        this.alumnoPath = '/api/alumnos';
        this.maestroPath = '/api/maestros';
        this.authPath = '/api/auth';
        this.cursoPath = '/api/cursos'

        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.authPath, require('../routers/auth.routes'));
        this.app.use(this.alumnoPath, require('../routers/alumno.routes'));
        this.app.use(this.maestroPath ,require('../routers/maestro.routes'));
        this.app.use(this.cursoPath, require('../routers/curso.routes'));
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log('Servidor ejecutandose y escuchando el puerto', this.port)
        });
    }
}

module.exports = Server;
