/*const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});


module.exports = mongoose.model('User', UserSchema);

*/

// ahora pasaremos todo el código anterior a TypeScript
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

export default mongoose.model<IUser>('User', UserSchema);
