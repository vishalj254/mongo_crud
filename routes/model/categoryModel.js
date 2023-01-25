var mongoose=require('mongoose')
const categorySchema=mongoose.Schema({
    /*categoryname
description
picture
created_on
updated_on*/
category_name:{
    type:"string",
    required:true
},
description:{
    type:"string",
    required:true
},
picture:{
    type:"string",
    required:true
}
},
{
    timestamps:{
        createdAt:"created_on",
        updatedAt:"updated_on"
    }
})
module.exports=mongoose.model("category",categorySchema)