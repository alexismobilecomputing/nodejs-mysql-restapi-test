import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    nameanimal: { type: String},
    typeanimal: { type: String},
    ageanimal: { type: Number},
    filename: { type: String},
    path: { type: String},
    originalname: { type: String},
    mimetype: { type: String},
    size: { type: Number},
    created_at: {type: Date, default: Date.now()}
})

export const Image = mongoose.model('image', imageSchema);