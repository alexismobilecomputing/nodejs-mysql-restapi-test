import { Router } from 'express'
import multer from 'multer'; //Para la recepcion de imagenes.
import { Image } from '../models/Image.js'

import fs from 'fs';

//No lo use al final IGUAL VERLO..
// import { unlink } from 'fs-extra'; //no deja importarlo asi, hay q hacerlo de la forma convencional
// import pkg from 'fs-extra';
// const { unlink } = pkg;

import { v4 as uuidv4 } from 'uuid'; //Lo uso para generar IDS aleatorios para los nombres de mis fotos
import path from 'path';

import { requireToken } from '../middlewares/requireToken.js';

const router = Router();

const storage = multer.diskStorage({ //en esta variable definimos, donde se van a guardar los archivos y con que nombre.
    destination: function (req, file, cb) { //el destino, donde se van a guardar
        cb(null, 'src/public/uploads')
    },
    // filename: function (req, file, cb) { //eSTO ES COMO VAMOS A guardar las imagenes
    //     cb(null, file.originalname) //1 param es null, es decir q no le paso ningun error.
    // }                               //2 param, es el nombre como quiero nombrar al archivo en este caso "file.originalname" es el nombre del archivo subido junto con su extension

    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname)) //A diferencia de lo q hacia arriba, le voy a concatenar un Id aleatorio al comienzo del nombre del archivo
        //el path.extname(), lo q hace es extraerme la extension del nombre ej: index.html -> me devolveria .html
    }

});

const upload = multer({ storage: storage });

//Trae todas las imagenes, pero solo le devuelvo el nombre, edad, tipoAnimal y la extension de la foto
router.get('/upload', requireToken, async (req, res) => {
    try {
        //Se puede escribir todos los parametros q NO quiero q traiga
        // const images = await Image.find({}, { __v: 0, mimetype:0  }); 

        // O puedo decirle los parametros que SI quiero q traiga q son los 4 campos q necesito en el frontend
        const animales = await Image.find().select('nameanimal ageanimal typeanimal filename');
        res.json(animales);
    } catch (error) {
        res.status(400).json({ errorMessage: `Error al traer los animales` })
    }
});

//Subo una imagen , Le agregue una validacion q pide token , con el middleware requireToken
router.post('/upload', requireToken, upload.single('file'), async (req, res) => { //El nombre file es la palabra en donde espera el servidor q le envieemos la imagen desde el front
    // console.log("FILE CON LA INFO:", req.file) //En el file viene la imagen
    // console.log("BODY CON LA INFO:", req.body) //En el body el resto de los campos

    try {
        //Cada vez que cargue una imagen le voy a crear un id propio y le voy a cambiar el nombre
        const image = new Image()
        image.nameanimal = req.body.name;
        image.ageanimal = req.body.age;
        image.typeanimal = req.body.typeAnimal;
        image.filename = req.file.filename; //Aca tengo guardado en vez de perroo.jpg -> elIdgenerado.jpg, q es el nombre de como esta guardado el archivo ahora.
        image.path = 'src/public/uploads/' + req.file.filename;
        image.originalname = req.file.originalname; //EJ: perroo.jpg
        image.mimetype = req.file.mimetype;
        image.size = req.file.size;
        await image.save();//Guardo la imagen en la base de datos

        res.json({ message: 'Archivo cargado con exito' })
    } catch (error) {
        res.status(400).json({ errorMessage: `No se pudo subir la imagen` })
    }
})

//Le agregue una validacion q pide token , con el middleware requireToken
router.delete('/upload/:id', requireToken, async (req, res) => {
    const idAnimal = req.params.id;
    try {
        // const result = await Image.deleteOne({ "_id": idAnimal });

        //Esto no solo elimina la imagen, sino que me devuelve toda la info q tenia el registro de la imagen antes de ser eliminada
        //Entre otras cosas aca tenemos la info del path donde estaba guardada en el servidor, para asi poder eliminarla tambien
        const imageDeleted = await Image.findByIdAndDelete(idAnimal);

        fs.unlink(imageDeleted.path, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('El archivo se ha eliminado correctamente del servidor.');
        });

        return res.json(imageDeleted);

    } catch (error) {
        res.status(400).json({ errorMessage: `No se pudo eliminar el animal` })
    }
});

//Le agregue una validacion q pide token , con el middleware requireToken
router.put('/upload', requireToken, async (req, res) => {
    const body = req.body;
    try {
        const result = await Image.findByIdAndUpdate(body._id, {
            "nameanimal": body.nameanimal,
            "ageanimal": body.ageanimal,
            "typeanimal": body.typeanimal
        })
        return res.json({ message: "Registro actualizado" });
    } catch (error) {
        res.status(400).json({ errorMessage: `No se pudo actualizar el animal` })
    }
});


export default router;

// Ejemplo de como leer un archivo dentro de uploads
// http://localhost:3000/public/uploads/perroo.jpg