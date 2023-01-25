var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var User = require('./routes/model/usersModel')
var crypto = require('crypto')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var database = require('./routes/database')
var userRouter = require('./routes/user')
var categoryRouter=require('./routes/category')
var subCategoryRouter=require('./routes/subcategory')
var genreRouter=require('./routes/genre')
var videoRouter=require('./routes/video')
database()
var app = express();

// view engine setup
app.use(cors({ credentials: true, exposedHeaders: ["set-cookie"], origin: ['http://localhost:3000'] }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/** */
app.use(session({ secret: "MySecret", resave: false, saveUninitialized: true, cookie: { maxAge: 3600000 } }))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy({ usernameField: "email" }, function (email, password, next) {
  User.find({
    $or: [{ email: email },
    { mobileNo: email }]
  }, function (error, result) {
    if (error) {
      return next(error, {
        status: false,
        msg: error
      })
    }
    else {
      if (result.length > 0) {
        const encPassword = crypto.pbkdf2Sync(password, result[0].salt, 1000, 200, 'sha512').toString('hex')
        if (encPassword == result[0].password) {
          next(null, {
            status: true,
            data: result[0],
            msg:"Login successfully"
          })
        } else {
          return next(null, {
            status: false,
            msg: "Invalid password"
          })
        }
      }
      else {
        return next(null, {
          status: false,
          msg: "Invalid email/mobile no"
        })
      }
    }
  })
}))

passport.serializeUser(function (user, next) {
  next(null, user)
})

passport.deserializeUser(function (user, next) {
  next(null, user)
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/category',categoryRouter)
app.use('/subcategory',subCategoryRouter)
app.use('/genre',genreRouter)
app.use('/video',videoRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
