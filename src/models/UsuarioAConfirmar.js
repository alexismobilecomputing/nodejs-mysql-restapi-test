import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';

const usuarioAConfirmarSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
})

//Esto se ejecuta siempre antes de hacer el usuarioAConfirmar.save() en el controller
//En este caso solo estoy encriptando la password
usuarioAConfirmarSchema.pre("save", async function (next) {
    try {
        const salto = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salto);
        next();
    } catch (error) {
        throw new Error("Fallo el hash de cntraseña");
    }
})

//El .methods es parte de la documentacion, y el atributo siguiente es el q inventamos, podemos poner lo q queramos, en este caso comparePassword
// usuarioSchema.methods.comparePassword = async function(candidatePassword){ //candidatePassword es la que esta intentando mandar el cliente
//     return await bcryptjs.compare(candidatePassword, this.password) //El this.password, es la contraseña q esta en la base de datos, que fue cargada momentaneamente cuando trajimos el usuario q coincidia con el mail enviado por el cliente
// }

export const UsuarioAConfirmar = mongoose.model('usuarioAConfirmar', usuarioAConfirmarSchema)