// const express = require('express'); ->Asi escribiamos antes para obtener los conocidos CommonJSModule
import express, { json } from 'express' // ->Esta es la forma mas moderna se los conoce como los ESModule
//Para que funcione tenemos q tener instalado como min la version 16 de node.

import employeesRoutes from './routes/employees.routes.js'
import indexRoutes from './routes/index.routes.js'

import authRoutes from './routes/auth.routes.js' //Son las rutas q voy a usar para probar mi base de datos de mongoDB

import animalsMongoDB from './routes/animalsMongoDB.routes.js'

import cors from 'cors';

import cookieParser from 'cookie-parser';

import imagesMongoDB from './routes/imagesMongoDB.routes.js'

const app = express();

app.use(cookieParser()) //Para poder usar las cookies, las habilito, que me van a servir para guardar mi token

app.use(cors()); //Con esto permite que cualquier cliente pueda acceder a este servidor, SI QUISIERA QUE SOLO mi localhost:4200 tubiese acceso, tendria q poner asi => app.use(cors({ origin: 'http://localhost:4200' }))

app.use(express.json()); //->Antes de pasar los datos q mando por ej en un post por las rutas voy a convertirlos en json, sino lee buffer

app.use(indexRoutes);//A diferencia del employeeRoutes no le quiero agregar ningun pedazo de ruta antes de las rutas q contiene.
app.use('/api', employeesRoutes); //Traigo todas las rutas, y ademas le digo que al comiendo de todas las rutas va a tener /api -> Ej: http://localhost:3000/api/employees   

app.use(authRoutes);//Son las rutas para probar mi base de datos mongoDB

app.use(animalsMongoDB);//En estas rutas voy a probar distintos llamados de mongoDB todos hechos por mi

app.use(imagesMongoDB);;//Las rutas para probar la subida, carga y eliminacion de imagenes en mongoDB

//Public desde afuera
// app.use('/public',express.static('./public'));
//Public desde adentro
app.use('/public',express.static('src/public'));//Hago que la carpeta public sea estatica. Imagenes, archivos etc que hayan en esta carpeta se pueden acceder directamente


// Si paso por todas las rutas anteriores y no la encontro, va a entrar aca y le devolvera notfound, sino por defecto nos devuelve un html que dice cannot get y la ruta.
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint Not found'
    })
})

export default app //Lo exporto para usarlo y pegarlo en el index.