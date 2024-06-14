const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        question: {
            type: String,
            required: [true, "Please provide question"],
        },
        description: {
            type: String,
            default: ""
        },
        important: {
            type: Boolean,
            default: false
        },
        code: {
            type: String,
            default: "No answere available"
        },
        language: {
            type: String,
            default: "java"
        },
        companyTag: {
            type: String,
            default: ""
        },
        link: {
            type: String,
            default: ''
        },
        date: {
            type: Date,
            default: Date.now
        },
        visibility: {
            type: String,
            default: 'private'
        },
        comment: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'comment'
            }
        ]
    },
    {
        timestamps: true
    }
)

const Notes = mongoose.model('note', NoteSchema);
module.exports = Notes;