const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");

// Require Routes
const indexRouter = require('./routes/index');
const postsRouter = require("./routes/posts");
const reviewsRouter = require("./routes/reviews");

const User = require('./models/user');

const app = express();

// connect to datebase
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/surf-shop');
  console.log("MongoDB Connected");
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
app.use(
    session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: true
        // cookie: { secure: true }
    })
);

// Configure Pasport and Sessions
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use('/', indexRouter);
app.use("/posts", postsRouter);
app.use("/posts/:id/reviews", reviewsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
