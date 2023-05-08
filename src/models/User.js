import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';

// Schema -> Es para instanciar el Schema
// model -> Creador de modelos


//El SCHEMA es la estructura del documento, no se van a poder agregar nuevos atributos o tipos de datos q no esten en el esquema, es una validacion de seguridad
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true, //Que limpie los datos de izquierda a derecha
        unique: true, //No se puede repetir
        lowercase: true, //se va a guardar en lowercase
        // index: { unique: true } //Nos indexa los datos, Siempre hay q ver si es necesario usar esto, porque ocupa bastante maquina
    },
    password: {
        type: String,
        required: true
    },
    repassword: {
        type: String,
        required: false
    }
})

// Los schemas nos dan la posibilidad de q antes de q guardemos algo en la base de datos, nosotros podamos hacer ciertas operaciones
// Podemos interceptar la peticion antes de que se guarde en nuestra base de datos

//Cada vez q querramos guardar algo va a hashear el password
userSchema.pre("save", async function (next) {

    //Este "save" se va a ejecutar tambien cuando actualicemos al usuario
    //Entonces, si el password no fue modificado hacemos un return.
    if(!this.isModified('password')) return next();

    try {
        const salto = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salto);
        next();
    } catch (error) {
        console.log(error);
        throw new Error("Fallo el hash de cntraseña");
    }
})

//El .methods es parte de la documentacion, y el atributo siguiente es el q inventamos, podemos poner lo q queramos, en este caso comparePassword
userSchema.methods.comparePassword = async function(candidatePassword){ //candidatePassword es la que esta intentando mandar el cliente
    return await bcryptjs.compare(candidatePassword, this.password) //El this.password, es la contraseña q esta en la base de datos.
}
// Una vez que tenemos el USER SCHEMA tenemos que transformarlo en un modelo

export const User = mongoose.model('user', userSchema)