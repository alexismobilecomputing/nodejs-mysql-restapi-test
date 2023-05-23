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

export const generateRefreshToken = (uid, res) => {
    console.log("entre al generateRefreshToken id: ", uid)
    //Como es un token de refresh puede durar mas.
    //EJ: 60 * 60 * 24 * 30  => Para que dure 30 dias
    const expiresIn = 60 * 10
    try {
        const refreshToken = jwt.sign({ uid: uid }, process.env.JWT_REFRESH, { expiresIn: expiresIn });
        console.log("refreshToken: ", refreshToken)
        //Tengo q guardar el refresh token, puede ser en una coockie o donde quiera, este no importa si lo roban porque no es el que valida las peticiones
        //Este token es solo para regenerar otro token.

        res.cookie("refreshToken", refreshToken, { //Las cookies al igual que el localstorage, pueden ser accedidos por cualqueir persona desde el navegador
            httpOnly: true,//La cookie solo va a vivir en el intercambio http en el intercambio, NO VA A PODER SER ACCEDIDO CON JAVASCRIPT DESDE EL FRONTEND
            secure: !(procees.env.MODO === "developer"), //Esto es para que viva en https, pero nosotros cuando trabajamos local usamos http, entonces le prgeuntamos a la variable de entorno modo q creamos para q si estamos en local ponga en false sino en true, en produccion siempre tiene q estar en true
            expires: new Date(Date.now + expiresIn * 1000)// Es * 1000, ya que esta en milisegundos.
        })

        // return refreshToken; //En este caso no necesitamos la expiracion, solo el token.

    } catch (error) {
        console.log(error)
    }
}