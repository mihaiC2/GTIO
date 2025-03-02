/*
const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    singer: { type: mongoose.Schema.Types.ObjectId, ref: 'Singer', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vote', VoteSchema);
*/
import mongoose, { Schema, Document, ObjectId } from 'mongoose';

interface IVote extends Document {
    user: ObjectId;
    singer: ObjectId;
    createdAt: Date;
}
const VoteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    singer: { type: Schema.Types.ObjectId, ref: 'Singer', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IVote>('Vote', VoteSchema);