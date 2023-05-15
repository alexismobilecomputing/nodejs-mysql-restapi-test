import mongoose from "mongoose";

const animalSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        unique: true,
        lowercase : true
    },
    typeAnimal:{
        type: String,
        require: true,
    },
    age:{
        type: Number,
        require : true,
        uppercase: true
    },
    photo:{
        type: String,
        require : true,
    }
})

export const Animal = mongoose.model('animal', animalSchema)