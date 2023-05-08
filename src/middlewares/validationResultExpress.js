import { validationResult  } from "express-validator";

//Este middleware valida si hay errores en las validaciones que vinieron del req en una peticion http
export const validationResultMiMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next() //Si esta todo bien avanza y sale de este middleware
}

export default validationResultMiMiddleware