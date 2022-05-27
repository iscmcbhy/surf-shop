const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

// No need for Password and username because of passport-local-mongoose require both
const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    image: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);