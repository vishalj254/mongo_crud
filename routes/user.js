var express = require('express')
var router = express.Router()
var crypto = require('crypto')
var User = require('./model/usersModel')
var ResetPassword = require('./model/resetPasswordModel')
const { default: mongoose } = require('mongoose')
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login')

router.post('/signUp', function (req, res) {
    if (req.body.password) {
        var salt = crypto.randomBytes(32).toString('hex')
        req.body.salt = salt
        var encPassword = crypto.pbkdf2Sync(req.body.password, salt, 1000, 200, 'sha512').toString('hex')
        req.body.password = encPassword
    }

    var user = new User(req.body)
    user.save(function (error, result) {
        if (error) {
            res.status(500).json({ status: false, msg: error.message })
        }
        else {
            res.status(200).json({ status: true, msg: 'Signup successfully', data: result })
        }
    })
})

// to get the data according to the user id
router.get('/display/:_id', connectEnsureLogin.ensureLoggedIn("/error"), function (req, res) {
    var { _id } = req.params
    User.findOne({ _id: _id }, 'firstName lastName email mobileNo', function (error, result) {
        if (error) {
            res.status(500).json({ status: false, msg: error.message })
        }
        else {
            res.status(200).json({ status: true, msg: 'data found', data: result })
        }
    })
})

// to update the user information except password
router.put('/:_id', connectEnsureLogin.ensureLoggedIn("/error"), function (req, res) {
    var { _id } = req.params
    User.findOneAndUpdate({ _id: _id }, { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, mobileNo: req.body.mobileNo }, { new: true }, function (error, result) {
        if (error) {
            res.status(500).json({ status: false, msg: error.message })
        }
        else {
            res.status(200).json({ status: true, msg: 'data updated', data: result })
        }
    })
})

router.post('/login', passport.authenticate("local", {
    failureRedirect: "/error",
    failureMessage: true
}), function (req, res) {
    res.status(200).json(req.user)
})

router.post('/forgotpassword', function (req, res) {
    User.findOne({ $or: [{ email: req.body.email }, { mobileNo: req.body.email }] }, function (error, result) {
        if (error) {
            res.status(500).json({ status: false, msg: error })
        }
        else {
            if (result) {
                var resetPassword = new ResetPassword({ userid: result._id, expiredAt: new Date().valueOf() + 600000, isUsed: false })
                resetPassword.save(function (err, reslt) {
                    if (error) {
                        res.status(500).json({ status: false, msg: err })
                    }
                    else {
                        res.status(200).json({ status: true, msg: 'Account Found', data: reslt._id })
                    }
                })

            }
            else {
                res.status(200).json({ status: false, msg: 'invalid email/mobile no' })
            }
        }
    })
})

router.post('/validLink', function (req, res) {
    console.log(req.body);
    ResetPassword.find({
        expiredAt: {
            $gte: new Date().valueOf()
        }
        , isUsed: false,
        _id: mongoose.Types.ObjectId(req.body.id)
    }, function (error, result) {
        if (error) {
            console.log(error)
            res.status(500).json({ status: false, msg: error })
        }
        else {
            console.log(result)
            if (result.length > 0) {
                res.status(200).json({ status: true, data: result[0], msg: 'link is valid' })
            }
            else {
                res.status(200).json({ status: false, msg: 'error' })
            }
        }
    })
})


router.put('/resetpassword/:resetid', function (req, res) {
    console.log("here");
    const salt = crypto.randomBytes(32).toString('hex')
    console.log(salt);
    const encPassword = crypto.pbkdf2Sync(req.body.password, salt, 1000, 200, 'sha512').toString('hex')
    User.findOneAndUpdate({ _id: req.body.id }, { password: encPassword, salt: salt }, { new: true }, function (error, result) {
        if (error) {
            res.status(500).json({ status: false, msg: error })
        }
        else {
            ResetPassword.findByIdAndUpdate({ _id: req.params.resetid }, { isUsed: true }, function (err, reslt) {
                if (err) {
                    res.status(500).json({ status: false, msg: error })
                } else {
                    res.status(200).json({ status: true, msg: "New password created successfully" })
                }
            })
        }
    })
})

router.get("/logout", connectEnsureLogin.ensureLoggedIn("/error"), function (req, res) {
    req.logout(function (err, result) {
        if (err) {
            res.status(500).json({ status: false, msg: "Server error!" })
        } else {
            res.status(200).json({ status: true, msg: "Logging out..." })
        }
    });
})
module.exports = router