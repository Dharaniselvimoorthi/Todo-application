const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userTask: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Todo", taskSchema);