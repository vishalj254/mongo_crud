var mongoose = require('mongoose')
var resetPasswordSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    expiredAt: {
        type: 'string',
        required: true
    },
    isUsed: {
        type: mongoose.Schema.Types.Boolean,
        required: true
    }
},
    {
        timeStamp: {
            createdAt: true,
            updatedAt: true
        }
    })
module.exports = mongoose.model("resetPassword", resetPasswordSchema)