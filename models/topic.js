var mongoose = require("mongoose");

//SCHEMA SETUP
var topicSchema = new mongoose.Schema({
    name: String,
    description: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});

module.exports = mongoose.model("Topic", topicSchema);