import { validationResult } from "express-validator";
import { Usuario } from '../models/Usuario.js'

import jwt from 'jsonwebtoken'
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

import { transport, generateMessageMail } from "../utils/configMail.js";

import { UsuarioAConfirmar } from "../models/UsuarioAConfirmar.js"

import nodemailer from 'nodemailer';

export const preregistro = async (req, res) => {
    const { email, password } = req.body;
    try {
        //1-Si el usuario existe le fuerzo el error y no lo dejo registrarse
        let usuarioAConfirmar = await Usuario.findOne({ email })
        if (usuarioAConfirmar) throw ({ code: 11000 })
        /////////////////

        usuarioAConfirmar = new UsuarioAConfirmar({ email, password });

        //2 Voy a guardar en una tabla usuarioAEspera de confirmacion,
        //Esta tabla va a tener el usuario y contraseña encriptada con su id, para q cuando verifique el mail ahora si se registre en la tabla de usuarios posta.
        //IMPORTANTE//Ya una vez cargado el shema del usuario, antes de hacer el save, va a pasar por el pre y va a encriptar la contraseña
        const result = await usuarioAConfirmar.save();
        //3- Genero un token q venza a los 5 min, con el id que me venga del resultado de agregar un usuarioAConfirmar

        const { token, expiresIn } = generateToken(result.id);

        //4- Ahora que tengo el token(que solo tiene el id) le envio un email con el link del token para verificar la cuenta
        //Si el token esta vencido, tiene q volver a intentar registrarse.
        //No importa si el mail esta cargado en los usuariosAConfirmar, siempre voy a ver si existe en la tabla oficial de usuarios.

        //Send mail//
        const info = await transport.sendMail(generateMessageMail(token, email));


        ///send mail///

        //5- Ahora tengo q armar otra ruta q reciba el token, tomar de ahi el id y si el token no esta vencido 
        //Registrar el usuario con el usuario y password encriptados guardados en la tabla usuariosAConfirmar usando el id del token.

        return res.json({ ok: true })

    } catch (error) {

        if (error.code === 11000) {//Normalmente cuando ya existe el registro te da un error 11000
            return res.status(400).json({ errorMessage: "Ya existe un usuario con ese email" })//Al email lo puse como Unique
        }
        return res.status(500).json({ errorMessage: "Error de servidor" })
    }
};

export const registrousuario = async (req, res) => {
    try {
        const tokenAConfirmar = req.params.token;

        //1-Con el token que me vino de la url de confirmacion, lo abro y busco el registro de la tabla de usuarios a confirmar.
        const payload = jwt.verify(tokenAConfirmar, process.env.JWT_SECRET)

        //2-Con el id busco en la tabla y agarro sus valores para registrar un usuario ahora si en la tabla final de 'Usuario'
        const usuarioAConfirmar = await UsuarioAConfirmar.findById(payload.uid)

        const usuarioARegistrar = new Usuario({ email: usuarioAConfirmar.email, password: usuarioAConfirmar.password })

        const result = await usuarioARegistrar.save();
        
        res.redirect('https://primer-app-angular.web.app/confirm-register');


    } catch (error) {
        res.redirect('https://primer-app-angular.web.app/error-register')
    }

}

export const register = async (req, res) => {

    const { email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({ email })
        //Si el mail existe directamente le fuerzo el error y le cargo un codigo 11000
        //No es necesario hacer esto, si al hacer usuario.save() nos diera error por ej xq ya existe el mail, nos mandaria directamente al catch error, con el codigo 11000 y otros atributos mas.

        //Al hacer esta comprobacion antes de si existe el mail, si existe NUNCA llega a hacer el save() si quiera
        if (usuario) throw ({ code: 11000 })//Al setearle este codigo, cuando entra en el catche entra en el if de este codigo y muestra ese error.
        //REALMENTE NO ES NECESARIO HACER ESTA CONSULTA PREVIA, ya que si el usuario existiese al hacer SAVE() y da error, va directamente al catch error

        usuario = new Usuario({ email, password }); //No le paso el repassword, eso era solo para validar no lo quiero guardar en mi base de datos
        //new Usuario({"email":email, "password":password}) Esta es otra forma de escribirlo, pero como es redundante coinciden los nombres no hace falta ponerlo asi, esto es algo de javascript

        //IMPORTANTE//Ya una vez cargado el shema del usuario, antes de hacer el save, va a pasar por el pre y va a encriptar la contraseña
        await usuario.save();

        //JWT aca despues va a ir el jwt

        return res.json({ ok: true })

    } catch (error) {
        if (error.code === 11000) {//Normalmente cuando ya existe el registro te da un error 11000
            return res.status(400).json({ errorMessage: "Ya existe un usuario con ese email" })//Al email lo puse como Unique
        }
        return res.status(500).json({ errorMessage: "Error de servidor" })
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let usuario = await Usuario.findOne({ email }) //Si encuentra el email, crea una variable usuario momentanea, con los valores del usuario de la base de datos
        if (!usuario) return res.status(400).json({ errorMessage: "El email ingresado no está registrado" });

        const respuestaPassword = await usuario.comparePassword(password); //El password que envio por parametro es el q acaba de ingresar desde el cliente

        if (!respuestaPassword) return res.status(403).json({ errorMessage: "La password ingresada es incorrecta" }) //Muchos ponen credenciales o datos incorrectos, para no orientar en q se equivocaron


        //GENERO EL TOKEN JWT
        const { token, expiresIn } = generateToken(usuario.id);

        //Guardo el token en una cookie llamada token, q va a estar en el navegador
        // res.cookie("token",token,{ //Las cookies al igual que el localstorage, pueden ser accedidos por cualqueir persona desde el navegador
        //     httpOnly: true,//La cookie solo va a vivir en el intercambio http en el intercambio, NO VA A PODER SER ACCEDIDO CON JAVASCRIPT DESDE EL FRONTEND
        //     secure: !(procees.env.MODO === "developer") //Esto es para que viva en https, pero nosotros cuando trabajamos local usamos http, entonces le prgeuntamos a la variable de entorno modo q creamos para q si estamos en local ponga en false sino en true, en produccion siempre tiene q estar en true
        // }) 

        generateRefreshToken(usuario.id,res)

        return res.json({ token: token, expiresIn }) //Se puede escribir de las 2 maneras si los nombres coinciden

    } catch (error) {
        return res.status(500).json({ errorMessage: "Error de servidor" })
    }
};


//Ruta para probar verificar token de usuarios registrados.
//Este token hay q enviarlo en el Auth y luego con el formato Bearer. (Envio el mismo token q me dan cuando ingreso)
export const infoUser = async (req, res) => {
    //Si llegue aca, es porque la persona valido bien el token y puede acceder a las acciones de esta ruta, en este caso solo devolvemos info del usuario.
    try {
        const usuario = await Usuario.findById(req.uid); //Este req.uid es la propiedad q le setie al requerimiento en el middleware de requireToken, el id lo saque de la variable payload.
        return res.json({ email: usuario.email }); //No quiero que le envie el password al cliente
    } catch (error) {
        return res.status(500).json({ errorMessage: "Error en el servidor" })
    }
}