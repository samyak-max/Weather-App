const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
    customId: String,
    name: String,
    location: Object,
    current: Object,
    uuid: String
});

const City = mongoose.model('City', CitySchema);

module.exports = City;