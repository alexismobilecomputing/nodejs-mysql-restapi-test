import { Router } from 'express'
import { getEmployees, getEmployee,createEmployee, updateEmployee,updatePatchEmployee , deleteEmployee } from '../controllers/employees.controller.js';

const router = Router();

//Al igual que si lo hicieramos con el app de app = express(), usaremos router que es un modulo especial de express


router.get('/employees', getEmployees)

router.get('/employees/:id', getEmployee)

router.post('/employees', createEmployee)

// router.put('/employees/:id', updateEmployee) //Si vas a actualizar todo 

router.patch('/employees/:id', updatePatchEmployee) //Es similar a la peticion put, con la diferencia de q podriamos querer actualizar parcialmente

router.delete('/employees/:id', deleteEmployee)

router.post('/pruebita/:id', deleteEmployee)


export default router  //Esto exporta todas las rutas

// IMPORTANTE:
// No hay problema si actualizaramos todo o parcialmente con PUT o PATCH, esto es simplemente una consideracion de REST