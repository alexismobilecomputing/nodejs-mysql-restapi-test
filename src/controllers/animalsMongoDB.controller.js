import { Animal } from '../models/Animal.js'

export const getAllAnimals = async (req, res) => {
    try {
        const animals = await Animal.find({}, {_id: 0,__v:0}); //Con esto le digo traeme todos los campos menos el _id y el __v
        return res.json(animals); //Me devuelve todos los animales
    } catch (error) {
       return res.status(500).json({error: "Error en el servidor"}) 
    }
}

export const createAnimal = async (req, res) => {
    console.log("Req body", req.body)

    try {

        const { name, typeAnimal, age } = req.body;
        const animal = new Animal({ name, typeAnimal, age });
        const animalSave = await animal.save();
        return res.json(animalSave);
    } catch (error) {
        console.log("error animal: ", error)
        res.json({"errorMessage":error})
    }

    // try {
    //     console.log("req",req.uid)
    //     const user = await User.findById(req.uid); //Este req.uid es la propiedad q le setie al requerimiento en el middleware de requireToken, el id lo saque de la variable payload.
    //     return res.json({email:user.email, id: user.id}); //No quiero que le envie el password al cliente
    // } catch (error) {
    //    return res.status(500).json({error: "Error en el servidor"}) 
    // }
}
