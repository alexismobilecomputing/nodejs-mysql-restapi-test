import jwt from 'jsonwebtoken'

export const generateToken = (uid) => {

    const expiresIn = 60 * 15 //15 min es lo q nos duraria el token, y hariamos un refresh token despues.
    //No es necesario usar el expireIn, podria no expirar nunca.
    try {
        const token = jwt.sign({ uid: uid }, process.env.JWT_SECRET, { expiresIn: expiresIn });
        
        return { token, expiresIn }; //AL LLAMARSE IGUAL NO HACE FALTA PONER token: token, lo smimo el expireIn
    } catch (error) {
        console.log(error)
    }
}