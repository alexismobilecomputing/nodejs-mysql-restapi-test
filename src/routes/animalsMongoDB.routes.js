import { Router } from 'express'
import { getAllAnimals, createAnimal, deleteAnimal } from '../controllers/animalsMongoDB.controller.js'
const router = Router();


router.get('/animals', getAllAnimals);

router.post('/animals', createAnimal);

router.delete('/animals/:id', deleteAnimal);

export default router;