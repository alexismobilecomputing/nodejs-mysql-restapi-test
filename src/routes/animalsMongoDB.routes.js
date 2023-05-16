import { Router } from 'express'
import { getAllAnimals, createAnimal, deleteAnimal, updateAnimal } from '../controllers/animalsMongoDB.controller.js'
const router = Router();

router.get('/animals', getAllAnimals);

router.post('/animals', createAnimal);

router.delete('/animals/:id', deleteAnimal);

router.put('/animals', updateAnimal);

export default router;