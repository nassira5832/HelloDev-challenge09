const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true
    },
    hashedPasswd: {
        type: String,
        required: true
    }
});


const userModel = mongoose.model("Users", userSchema);


module.exports = userModel;