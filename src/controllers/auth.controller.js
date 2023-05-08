import { validationResult } from "express-validator";
import { User } from '../models/User.js' //Me traigo los modelos que voy a usar para modificar la base de datos de mongodb

export const register = async (req, res) => {
    ////////////////////////// Esto podria estar en el mismo middleware q usa el login
    const errors = validationResult(req); //Si no es un email, va a viajar ese mensaje de error y va a venir en el req.
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //////////////////////////

    const { email, password } = req.body;
    try {
        let user = await User.findOne({email})
        //Si el mail existe directamente le fuerzo el error y le cargo un codigo 11000
        //No es necesario hacer esto, si al hacer user.save() nos diera error por ej xq ya existe el mail, nos mandaria directamente al catch error
        
        //Al hacer esta comprobacion antes de si existe el mail, si existe NUNCA llega a hacer el save() si quiera
        if(user) throw ({code: 11000})//Al setearle este codigo, cuando entra en el catche entra en el if de este codigo y muestra ese error.
        //REALMENTE NO ES NECESARIO HACER ESTA CONSULTA PREVIA, ya que si el usuario existiese al hacer SAVE() y da error, va directamente al catch error


        user = new User({ email, password }); //No le paso el repassword, eso era solo para validar no lo quiero guardar en mi base de datos
        //new User({"email":email, "password":password}) Esta es otra forma de escribirlo, pero como es redundante coinciden los nombres no hace falta ponerlo asi, esto es algo de javascript

        await user.save();

        //JWT aca despues va a ir el jwt

        return res.json({ ok: true })

    } catch (error) {
        if(error.code === 11000){//Normalmente cuando ya existe el registro te da un error 11000
            return res.status(400).json({error: "Ya existe el usuario"})
        }
        return res.status(500).json({ error: "Error de servidor"})
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
        let user = await User.findOne({email})

        if(!user) return res.status(400).json({error:"No existe el usuario registrado"});
        
        const respuestaPassword = await user.comparePassword(password); //Esto devuelve true o false

        if(!respuestaPassword) return res.status(403).json({error: "Contraseña incorrecta"}) //Muchos ponen credenciales o datos incorrectos, para no orientar en q se equivocaron

        return res.json({ok: 'Entre al login'})
        
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor"})
    }
};