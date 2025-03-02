/*const mongoose = require('mongoose');


const SingerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String }, 
    votes: { type: Number, default: 0 } 
});

module.exports = mongoose.model('Singer', SingerSchema);
*/
// ahora pasaremos el código anterior a TypeScript
import mongoose, { Schema, Document } from 'mongoose';

interface ISinger extends Document {
    name: string;
    image: string;
    votes: number;
}
const SingerSchema : Schema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String }, 
    votes: { type: Number, default: 0 } 
});

export default mongoose.model<ISinger>('Singer', SingerSchema);