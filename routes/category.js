var express = require('express')
var router = express.Router()
var upload = require('./multer')
const Category = require('./model/categoryModel')
const Constant = require('./constant')
var connectEnsureLogin = require('connect-ensure-login')
router.post('/add',connectEnsureLogin.ensureLoggedIn("/error"),upload.single('picture'), function (req, res) {

    req.body.picture = req.file.filename
    var category = new Category(req.body)
    category.save(function (error, result) {
        if (error) {
            res.status(500).json({ status: false, msg: error })
        }
        else {
            res.status(200).json({ status: true, msg: "category added successfully" })
        }
    })
})

router.get('/display', connectEnsureLogin.ensureLoggedIn("/error"), function (req, res) {
    // Category.find({}, { picture: { $concat: ["http://localhost:5000/images/", "$picture"], }, category_name: 1, created_on: 1, updated_on: 1 }, 
    Category.find({}, function (error, result) {
        if (error) {
            res.status(500).json({ status: false, msg: error })
        }
        else {
            const data = result.map((item) => ({ ...item._doc, picture: Constant.ImageURL + item.picture, id: item._id }))
            res.status(200).json({ status: true, msg: "category data found", data: data })
        }
    })
})

router.get('/display/:_id', connectEnsureLogin.ensureLoggedIn("/error"), function (req, res) {
    const { _id } = req.params
    Category.findOne({ _id: _id }, function (error, result) {
        if (error) {
            res.status(500).json({ status: false, msg: error })
        }
        else {
            if(result){
                result.picture = Constant.ImageURL + result.picture
            }
            res.status(200).json({ status: true, msg: "data found", data: result })
        }
    })
})
router.put('/update/:_id', connectEnsureLogin.ensureLoggedIn("/error"), upload.any(), function (req, res) {
    const { _id } = req.params
    if (req.files.length > 0) {
        req.body.picture = req.files[0].filename
        Constant.deleteFile(req.body.oldpicture)
    }
    Category.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (error, result) {
        if (error) {
            res.status(500).json({ status: false, msg: error })
        }
        else {
            res.status(200).json({ status: true, msg: "data updated", data: result })
        }
    })
})
router.delete('/delete/:_id', connectEnsureLogin.ensureLoggedIn("/error"), function (req, res) {
    const { _id } = req.params
    Category.findOneAndDelete({ _id: _id }, function (error, result) {
        if (error) {
            res.status(500).json({ status: false, msg: error })
        }
        else {
            console.log(result.picture);
            Constant.deleteFile(result.picture)
            res.status(200).json({ status: true, msg: "data deleted successfully" })
        }
    })
})
module.exports = router