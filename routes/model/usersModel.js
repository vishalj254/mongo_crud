var mongoose = require('mongoose')
var userSchema = mongoose.Schema({
    firstName: {
        type: 'string',
        required: true
    },
    lastName: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true,
        unique: false,
    },
    mobileNo: {
        type: 'string',
        required: true,
        unique: false,
    },
    password: {
        type: 'string',
        required: true
    },
    salt: {
        type: String,
        required: true
    }
},
    {
        timestamps: {
            createdAt: 'created_on',
            updatedAt: 'updated_on' 
          }
    })

userSchema.index({ email: 1, mobileNo: 1 }, { unique: true })
module.exports = mongoose.model("user", userSchema)