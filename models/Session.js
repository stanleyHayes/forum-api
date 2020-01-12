const mongoose =  require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    user_jwt: {
        type: String,
        required: true
    }
});

const Session = mongoose.model("Session", SessionSchema);

module.exports = Session;