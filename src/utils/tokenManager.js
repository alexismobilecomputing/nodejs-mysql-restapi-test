import jwt from 'jsonwebtoken'

export const generateToken = (uid) => {

    const expiresIn = 60 * 3 //3 min es lo q nos duraria el token, y hariamos un refresh token despues.
    //No es necesario usar el expireIn, podria no expirar nunca.
    try {
        //En el primer parametro es el objeto que contiene los datos y que deseamos incluir en el token, en este caso le estamos mandando el id, pero podria ser un json con otros valores tmb como role, nombre usuario, email, imagenes y cualquier otra cosa q queramos.
        const token = jwt.sign({ uid: uid }, process.env.JWT_SECRET, { expiresIn: expiresIn }); //Este es el payload, yo puedo mandar lo q quiera y llamar como quiera, le puse uid(userId) y le mando el id, porque despues en un futuro podria hacer una consulta sobre el usuario con solo saber su id
        //El JWT_SECRET es una clave secreta q INVENTAMOS nosotros q sirve para generar el token, y la tengo guardada en las variables de entorno

        return { token, expiresIn }; //AL LLAMARSE IGUAL NO HACE FALTA PONER token: token, lo smimo el expireIn
    } catch (error) {
        console.log(error) 
    }
}