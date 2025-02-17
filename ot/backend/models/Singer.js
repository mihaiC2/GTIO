const mongoose = require('mongoose');

const SingerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: {type: String, required: false},
    age: {type: Number, required: false},
    image: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }, 
    // votes: { type: Number, default: 0 } 
});

module.exports = mongoose.model('Singer', SingerSchema);
