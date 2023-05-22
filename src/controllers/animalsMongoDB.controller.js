import { Animal } from '../models/Animal.js'

export const getAllAnimals = async (req, res) => {
    try {
        // const animals = await Animal.find({}, {_id: 0,__v:0}); //Con esto le digo traeme todos los campos menos el _id y el __v
        const animals = await Animal.find({}, { __v: 0 }).sort({ name: 1 }).limit(20); //Con esto le digo traeme todos los campos menos el __v
        //Ademas le estoy diciendo, que ordene la lista por el nombre, y q traiga como maximo los primeros 20.

        return res.json(animals); //Me devuelve todos los animales
    } catch (error) {
        return res.status(500).json({ errorMessage: "Error en el servidor" })
    }
}

export const createAnimal = async (req, res) => {
    try {
        const { name, typeAnimal, age, photo } = req.body; //El photo es el nombre del archivo .extension
        const animal = new Animal({ name, typeAnimal, age, photo });
        const animalSave = await animal.save();
        return res.json(animalSave);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ errorMessage: `El nombre ${error.keyValue.name} ya existe` })
        }
    }
}

export const deleteAnimal = async (req, res) => {
    const idAnimal = req.params.id;
    try {
        const result = await Animal.deleteOne({ "_id": idAnimal });
        return res.json(result);
    } catch (error) {
        res.status(400).json({ errorMessage: `No se pudo eliminar el animal` })
    }
}

export const updateAnimal = async (req, res) => {
    const body = req.body;
    try {
        const result = await Animal.findByIdAndUpdate(body._id, {
            "name": body.name,
            "age": body.age,
            "typeAnimal": body.typeAnimal
        })

        return res.json({ message: "Registro actualizado" });
    } catch (error) {
        res.status(400).json({ errorMessage: `No se pudo actualizar el animal` })
    }
}
