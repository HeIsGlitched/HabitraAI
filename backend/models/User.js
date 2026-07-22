const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    resetCode: {
        type: String
    },
    resetCodeExpiry: {
        type: Date
    },
    lastResetRequest: {
        type: Date
    },
    aiInsight: {
    type: String,
    default: ""
},

lastInsightDate: {
    type: Date,
    default: null
}

},
    {
        timestamps: true
    })

module.exports = mongoose.model("User", userSchema);