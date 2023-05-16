import jwt from 'jsonwebtoken';

export const requireToken = (req, resp, next) => {
    try {
        //Vamos a mandar el token atravez de los headers en formato Bearer
        let token = req.headers.authorization; //El token llega en formato Bearer->  viene asi siempre "Bearer miTOKEN"
        if (!token) throw new Error('No Bearer')

        token = token.split(" ")[1]; //Hago esto porque el formato bearer viene asi siempre "Bearer miTOKEN", asi q le hago un split y tomo solo el token

        const payload = jwt.verify(token, process.env.JWT_SECRET) //Verifico si el token qu eme mandaron en el Barer es real
        req.uid = payload.uid; //Uid es el atributo que invente en donde yo guardaba el id del usuario cuando generaba el token, y que vuelve nuevamente en el token y lo uso para despues hacer la busqueda del usuario, y verificar si es real y existe
        //Este req.uid lo q hace es crearle un atributo uid, le asigno un valor y este puede ser usado por el siguiente middleware que le sige al de 'requireToken'
        next()//Si esta todo bien sigue al siguiente middleware

    } catch(error) {
        const TokenVerificationErrors = {
            "invalid signature": "La firma del JWT no es válida",
            "jwt expired": "JWT expirado",
            "invalid token": "Token no válido",
            "No Bearer": "Utiliza formato Bearer", //Este lo genere yo en la linea 7, el resto son errores de jwt
            "jwt malformed" : "JWT mal formado"
        }
        return resp
            .status(401) //Error 401 es cuando no estamos autorizados
            .send({error: TokenVerificationErrors[error.message]})

    }


}