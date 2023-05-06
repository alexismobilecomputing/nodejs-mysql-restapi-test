// const express = require('express'); ->Asi escribiamos antes para obtener los conocidos CommonJSModule
import express, { json } from 'express' // ->Esta es la forma mas moderna se los conoce como los ESModule
//Para que funcione tenemos q tener instalado como min la version 16 de node.

import employeesRoutes from './routes/employees.routes.js'
import indexRoutes from './routes/index.routes.js'

import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json()); //->Antes de pasar los datos q mando por ej en un post por las rutas voy a convertirlos en json, sino lee buffer

app.use(indexRoutes);//A diferencia del employeeRoutes no le quiero agregar ningun pedazo de ruta antes de las rutas q contiene.
app.use('/api',employeesRoutes); //Traigo todas las rutas, y ademas le digo que al comiendo de todas las rutas va a tener /api -> Ej: http://localhost:3000/api/employees   

//Si paso por todas las rutas anteriores y no la encontro, va a entrar aca y le devolvera notfound, sino por defecto nos devuelve un html que dice cannot get y la ruta.
app.use((req,res)=>{
    res.status(404).json({
        message: 'Endpoint Not found'
    })
})

export default app //Lo exporto para usarlo y pegarlo en el index.