const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    singer: { type: mongoose.Schema.Types.ObjectId, ref: 'Singer', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vote', VoteSchema);
