const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Roles = require('../utils/roles');


const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { 
        type: String,
        required: true,
        trim: true,
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    rol: { type: String, enum: Object.values(Roles), required: true }, 
}, {
    timestamps: true,
});

userSchema.pre("save", function (next) {
    if(this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 10);
    }    
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;




