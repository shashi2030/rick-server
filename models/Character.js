var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var characterSchema = new Schema({
    id: Number,
    name: String,
    status: String,
    species: String,
    type: String,
    gender: String,
    origin: {
        name: String,
        url: String
    },
    location: {
        name: String,
        url: String
    },
    image: String,
    episode: Array,
    url: String,
    created: String
});

var Character = mongoose.model('Character', characterSchema);
module.exports = Character;