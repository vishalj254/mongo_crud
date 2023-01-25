var mongoose=require('mongoose')
const genreSchema=mongoose.Schema({
    genrename:{
        type:"string",
        required:true
    },
},{
    timestamps:{
        createdAt:"created_on",
        updatedAt:"updated_on",
    }
})
module.exports=mongoose.model("genre",genreSchema)