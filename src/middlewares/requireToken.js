import jwt from 'jsonwebtoken';

export const requireToken = (req, resp, next) => {
    try {
        //Vamos a mandar el token atravez de los headers en formato Bearer
        let token = req.headers.authorization; //El token llega en formato Bearer
        if (!token) throw new Error('No Bearer')

        token = token.split(" ")[1]; //Hago esto porque el formato bearer viene asi siempre "Bearer miTOKEN", asi q le hago un split y tomo solo el token

        const payload = jwt.verify(token, process.env.JWT_SECRET) //Verifico si el token qu eme mandaron en el Barer es real
        req.uid = payload.uid; //Uid es el atributo que invente en donde yo guardaba el id del usuario cuando generaba el token, y que vuelve nuevamente en el token y lo uso para despues hacer la busqueda del usuario, y verificar si es real y existe
        next()//Si esta todo bien sigue al siguiente middleware

    } catch {

        const TokenVerificationErrors = {
            "invalid signature": "La firma del JWT no es válida",
            "jwt expired": "JWT expirado",
            "invalid token": "Token no válido",
            "No Bearer": "Utiliza formato Bearer" //Este lo genere yo en la linea 7, el resto son errores de jwt
        }

        return resp
            .status(401)
            .send({error: TokenVerificationErrors[error.message]})

    }


}