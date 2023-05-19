import { Router } from 'express'
import { register, login, infoUser, preregistro } from '../controllers/usuarioLoginMongoDB.controller.js'
import { requireToken } from '../middlewares/requireToken.js';

const router = Router();

router.post('/preregistro', preregistro);

router.post('/register', register);

router.post('/login', login);


//Esta ruta la uso para probar que envia bien el token y q existe.
//Primero pasa por el middleware q cree de requireToken, si esta todo ok va al siguiente middleware de infoUser
//PARA PROBARLA, HAGO UN LOGIN, Y EL TOKEN Q ME DEVUELVA ES EL Q VOY A MANDAR A ESTA URL EN EL APARTADO AUTH Y BEARER
router.get("/infoUser", requireToken, infoUser);

export default router;