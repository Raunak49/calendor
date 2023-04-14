const mongoose = require('mongoose');
const googleUserSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email: String,
    avatar: String,
    accessToken: String,
    refreshToken: String
});
const googleUser = mongoose.model('googleUser', googleUserSchema);
module.exports = googleUser;