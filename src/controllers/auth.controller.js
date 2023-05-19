import { validationResult } from "express-validator";
import { User } from '../models/User.js' //Me traigo los modelos que voy a usar para modificar la base de datos de mongodb

import jwt from 'jsonwebtoken'
import { generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
    ////////////////////////// Esto podria estar en el mismo middleware q usa el login
    const errors = validationResult(req); //Si no es un email, va a viajar ese mensaje de error y va a venir en el req.
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorMessage: errors.array() });
    }
    //////////////////////////

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        //Si el mail existe directamente le fuerzo el error y le cargo un codigo 11000
        //No es necesario hacer esto, si al hacer user.save() nos diera error por ej xq ya existe el mail, nos mandaria directamente al catch error

        //Al hacer esta comprobacion antes de si existe el mail, si existe NUNCA llega a hacer el save() si quiera
        if (user) throw ({ code: 11000 })//Al setearle este codigo, cuando entra en el catche entra en el if de este codigo y muestra ese error.
        //REALMENTE NO ES NECESARIO HACER ESTA CONSULTA PREVIA, ya que si el usuario existiese al hacer SAVE() y da error, va directamente al catch error


        user = new User({ email, password }); //No le paso el repassword, eso era solo para validar no lo quiero guardar en mi base de datos
        //new User({"email":email, "password":password}) Esta es otra forma de escribirlo, pero como es redundante coinciden los nombres no hace falta ponerlo asi, esto es algo de javascript

        await user.save();

        //JWT aca despues va a ir el jwt

        return res.json({ ok: true })

    } catch (error) {
        if (error.code === 11000) {//Normalmente cuando ya existe el registro te da un error 11000
            return res.status(400).json({ errorMessage: "Ya existe el usuario" })
        }
        return res.status(500).json({ errorMessage: "Error de servidor" })
    }
};

export const login = async (req, res) => {
    // TODO LO COMENTADO ES REEMPLAZADO POR UN MIDDLEWARE QUE EJECUTO EN EL LOGIN DE AUTHROUTES
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(400).json({errors : errors.array()});
    // }

    try {

        const { email, password } = req.body;
        let user = await User.findOne({ email })

        if (!user) return res.status(400).json({ errorMessage: "No existe el usuario registrado" });

        const respuestaPassword = await user.comparePassword(password); //Esto devuelve true o false

        if (!respuestaPassword) return res.status(403).json({ errorMessage: "Contraseña incorrecta" }) //Muchos ponen credenciales o datos incorrectos, para no orientar en q se equivocaron


        //GENERO EL TOKEN JWT

        // const token = jwt.sign({uid: user.id}, process.env.JWT_SECRET) //Este es el payload, yo puedo mandar lo q quiera y llamar como quiera, le puse uid(userId) y le mando el id, porque despues en un futuro podria hacer una consulta sobre el usuario con solo saber su id
        //El JWT_SECRET es una clave secreta q INVENTAMOS nosotros q sirve para generar el token, y la tengo guardada en las variables de entorno

        const { token, expireIn } = generateToken(user.id)

        //Guardo el token en una cookie llamada token, q va a estar en el navegador
        res.cookie("token", token, { //Las cookies al igual que el localstorage, pueden ser accedidos por cualqueir persona desde el navegador
            httpOnly: true,//La cookie solo va a vivir en el intercambio http en el intercambio, NO VA A PODER SER ACCEDIDO CON JAVASCRIPT DESDE EL FRONTEND
            secure: !(procees.env.MODO === "developer") //Esto es para que viva en https, pero nosotros cuando trabajamos local usamos http, entonces le prgeuntamos a la variable de entorno modo q creamos para q si estamos en local ponga en false sino en true, en produccion siempre tiene q estar en true
        })

        return res.json({ token: token, expireIn }) //Se puede escribir de las 2 maneras si los nombres coinciden
    } catch (error) {
        return res.status(500).json({ errorMessage: "Error de servidor" })
    }
};


//Ruta para probar verificar token de usuarios registrados.
//Este token hay q enviarlo en el Auth y luego con el formato Bearer. (Envio el mismo token q me dan cuando ingreso)
export const infoUser = async (req, res) => {

    //Si llegue aca, es porque la persona valido bien el token y puede acceder a las acciones de esta ruta, en este caso solo devolvemos info del usuario.
    try {
        console.log("req", req.uid)
        const user = await User.findById(req.uid); //Este req.uid es la propiedad q le setie al requerimiento en el middleware de requireToken, el id lo saque de la variable payload.
        return res.json({ email: user.email, id: user.id }); //No quiero que le envie el password al cliente
    } catch (error) {
        return res.status(500).json({ errorMessage: "Error en el servidor" })
    }
}