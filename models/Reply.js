const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reply: {
        type: String,
        required: true
    },
    date_posted: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: [Schema.Types.ObjectId]
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },
    date_modified: {
        type: Date,
        default: Date.now()
    }
});

const Reply = mongoose.model("Reply", ReplySchema);

module.exports = Reply;