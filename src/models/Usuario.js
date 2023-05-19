import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true, //Que limpie los datos de izquierda a derecha
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
})

//IMPORTANTE!!! Comente el pre save, porque me esta encriptando la password q ya encripte antes en usuarioAConfirmar
// //Esto se ejecuta siempre antes de hacer el usuario.save() en el controller
// usuarioSchema.pre("save", async function (next) {
//     //Este "save" se va a ejecutar tambien cuando actualicemos al usuario
//     //Entonces, si el password no fue modificado hacemos un return.
//     if(!this.isModified('password')) return next();

//     try {
//         const salto = await bcryptjs.genSalt(10);
//         this.password = await bcryptjs.hash(this.password, salto); //Le pasa por parametro, la password que vino del cliente y que le asigne al schema en usuarioLoginMongoDBController. Y esta password se encripta y es reemplazada por la anterior, guardando finalmente esta encriptada.
//         next();
//     } catch (error) {
//         throw new Error("Fallo el hash de cntraseña");
//     }
// })

//El .methods es parte de la documentacion, y el atributo siguiente es el q inventamos, podemos poner lo q queramos, en este caso comparePassword
usuarioSchema.methods.comparePassword = async function(candidatePassword){ //candidatePassword es la que esta intentando mandar el cliente
    return await bcryptjs.compare(candidatePassword, this.password) //El this.password, es la contraseña q esta en la base de datos, que fue cargada momentaneamente cuando trajimos el usuario q coincidia con el mail enviado por el cliente
}

export const Usuario = mongoose.model('usuario', usuarioSchema)