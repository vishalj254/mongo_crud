var express=require('express')
var router=express.Router()
var upload=require('./multer')
var SubCategory=require('./model/subCategoryModel')
const Constant = require('./constant')
var connectEnsureLogin = require('connect-ensure-login')


const { default: mongoose } = require('mongoose')
router.post('/add',connectEnsureLogin.ensureLoggedIn("/error"),upload.single('picture'),function(req,res){
    req.body.picture=req.file.filename
    var subCategory=new SubCategory(req.body)
    subCategory.save(function(error,result){
        if(error)
        {
            res.status(500).json({status:false,msg:error})
        }
        else{
            res.status(200).json({status:true,msg:"data added successfully"})
        }
    })
})
router.get('/display',connectEnsureLogin.ensureLoggedIn("/error"),function(req,res){
    SubCategory.aggregate([{$lookup:{from:"categories",localField:"categoryid",foreignField:"_id",as:"categoryData"}},
    {$unwind:"$categoryData"}],function(error,result){
        if(error)
        {
            res.status(500).json({status:false,msg:error})
        }
        
        else{
            const data = result.map((item) => ({ ...item, picture: Constant.ImageURL + item.picture, id: item._id }))
            res.status(200).json({status:true,msg:"data found",data:data})
        }
    })
})
router.get('/display/:subcategoryid',connectEnsureLogin.ensureLoggedIn("/error"),function(req,res){
    const id=req.params.subcategoryid
    SubCategory.aggregate([{$lookup:{from:"categories",localField:"categoryid",foreignField:"_id",as:"categoryData"}},{$match:{_id:mongoose.Types.ObjectId(id)}}],function(error,result){
        if(error)
        {
            res.status(500).json({status:false,msg:error})
        }
        else{
            result[0].picture = Constant.ImageURL + result[0].picture
            res.status(200).json({status:true,msg:"data found",data:result[0]})
        }
    })
})
//for dropdown acc to categoryid
router.get('/displaybycategoryid/:categoryid',function(req,res){
    const id=req.params.categoryid
    SubCategory.find({categoryid:mongoose.Types.ObjectId(id)}, function (error, result) {
        if (error) {
            res.status(500).json({ status: false, msg: error })
        }
        else {
            res.status(200).json({ status: true, msg: "sub category data found", data: result })
        }
    })
})

router.put('/update/:subcategoryid',connectEnsureLogin.ensureLoggedIn("/error"),upload.any(),function(req,res){
    const id=req.params.subcategoryid
    if(req.files.length>0)
    {
        req.body.picture=req.files[0].filename
        Constant.deleteFile(req.body.oldpicture)
    }
   SubCategory.findOneAndUpdate({_id:id},req.body,{new:true},function(error,result){
    if(error)
    {
        res.status(500).json({status:false,msg:error})
    }
    else{
        res.status(200).json({status:true,msg:"data updated",data:result})
    }
})
})
router.delete('/delete/:subcategoryid',connectEnsureLogin.ensureLoggedIn("/error"),function(req,res){
    const id=req.params.subcategoryid
    SubCategory.findOneAndDelete({_id:id},function(error,result){
        if(error){
            res.status(500).json({status:false,msg:error})
        }
        else
        {
            Constant.deleteFile(result.picture)
            res.status(200).json({status:true,msg:"Record deleted successfully"})
        }
    })
})
module.exports=router