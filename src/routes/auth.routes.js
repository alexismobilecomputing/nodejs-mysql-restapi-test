import express from 'express'
import { login, register } from '../controllers/auth.controller.js';

import { body } from 'express-validator'

//Esta validacion la hacia en el controlador, por ej en register lo hago, pero ahora decidi crear mi propio middleware y le agrego directamente eso, lo voy a hacer en el LOGIN, es exactamente lo mismo.
import { validationResultMiMiddleware } from '../middlewares/validationResultExpress.js'

const router = express.Router();

// router.post("/register", register)

// Las rutas pueden tener 1 o mas middleware
router.post("/register", [
    body('email', "Fornmato de email incorrecto").trim().isEmail().normalizeEmail(), //Esta es una validacion q dice que en el body me tiene q venir un campo email que traiga algo de tipo email y sino es esto, esto FALLA, y ejecuta el mensaje "formato de email incorrecto"
    // El normalizemail, es por si mandan cosas medias extrañas podemos normalizar el texto
    // Podemos concatenar todas las validaciones que queramos
    body('password', "Formato de password incorrecta")
        .trim()
        .isLength({ min: 6 }) //isLength minimo 6 caracteres
        .custom((value, { req }) => { //En el custom podemos nosotros diseñar la validacion, el value es el valor del password en este caso
            if (value != req.body.repassword) { //Esto es para validar la contraseña del si hubiese "confirmar contraseña o repassword"
                throw new Error("No coinciden las contraseñas")
            }
            return value;
        })
],
    register);


router.post("/login", [
    body('email', "Fornmato de email incorrecto").trim().isEmail().normalizeEmail(),
    body('password', "Formato de password incorrecta").trim().isLength({ min: 6 })
],
    validationResultMiMiddleware,//Ejecuto ese middleware, que en el register lo hago dentro del controller es lo MISMO
    //Cabe recordar que uno puede poner todos los middleware que quiera.
    login);



export default router;