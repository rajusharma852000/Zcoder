const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        name: {
            type: String,
            required: true
        },
        items: {
            type: []
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

const Comments = mongoose.model('comment', CommentSchema);

module.exports = Comments;