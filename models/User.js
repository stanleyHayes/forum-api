const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date_joined:{
        type: Date,
        default: Date.now()
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    imageUri: {
        type: String
    },
    about:{
        type: String
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;