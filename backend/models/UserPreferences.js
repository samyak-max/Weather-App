const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uuid: String,
    city: String,
    condition: String,
});

const UserPref = mongoose.model('UserPref', UserSchema);

module.exports = UserPref;