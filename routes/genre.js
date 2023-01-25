var express=require('express')
const { default: mongoose } = require('mongoose')
var router=express.Router()
const Genre=require('./model/genreModel')
var connectEnsureLogin=require('connect-ensure-login')
router.post('/add',connectEnsureLogin.ensureLoggedIn("/error"),function(req,res){
    const genre=new Genre(req.body)
    genre.save(function(error,result){
        if(error){
        res.status(500).json({status:false,msg:error})
    }
    else
    {
        res.status(200).json({status:true,msg:"data added successfully" })
    }
    })
})
router.get('/display',connectEnsureLogin.ensureLoggedIn("/error"),function(req,res){
    Genre.find(function(error,result){
        if(error){
            res.status(500).json({status:false,msg:error})
        }
        else{
            const data = result.map((item) => ({ ...item._doc,id: item._id }))
            res.status(200).json({status:true,msg:"data found",data:data})
        }
    })
})
router.get('/display/:genreid',connectEnsureLogin.ensureLoggedIn("/error"),function(req,res){
    const id=req.params.genreid
    Genre.findOne({_id:id},function(error,result){
        if(error){
            res.status(500).json({status:false,msg:error})
        }
        else
        {
            res.status(200).json({status:true,msg:"data found",data:result})
        }
    })

})
//for dropdown of genre acc to subcategoryid
router.get('/displaybysubcategoryid/:subcategoryid',function(req,res){
   const id=req.params.subcategoryid
   Genre.find({subcategoryid:mongoose.Types.ObjectId(id)},function(error,result){
    if(error){
        res.status(500).json({status:false,msg:error})
    }
    else
    {
        res.status(200).json({status:true,msg:"data found",data:result})
    }
   })
})
router.put('/update/:genreid',connectEnsureLogin.ensureLoggedIn("/error"),function(req,res){
    const id=req.params.genreid
    Genre.findOneAndUpdate({_id:id},req.body,{new:true},function(error,result){
        if(error){
            res.status(500).json({status:false,msg:error})
        }
        else
        {
            res.status(200).json({status:true,msg:"data udated successfully",data:result})
        }
    })
})
router.delete('/delete/:genreid',connectEnsureLogin.ensureLoggedIn("/error"),function(req,res){
    const id=req.params.genreid
    Genre.findOneAndDelete({_id:id},function(error,result){
        if(error){
            res.status(500).json({status:false,msg:error})
        }
        else
        {
            res.status(200).json({status:true,msg:"data deleted successfully"})
        }
    })

})

module.exports=router