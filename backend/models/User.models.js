const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            minlength: 3,
        },
        password: {
            type: String,
            required: true,
            minlength: 5
        },
        profilePicture: {
            type: String,
            default: ""
        },
        techStack: {
            type: String,
            default: ""
        },
        programmingLanguages: {
            type: String,
            default: ""
        },
        dateOfBirth: {
            type: String,
            default: ""
        },
        profession: {
            type: String,
            default: "  "
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('user', UserSchema);
module.exports = User;