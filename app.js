const dotenv = require("dotenv");
dotenv.config();
const createError = require('http-errors');
const express = require('express');
const engine = require("ejs-mate");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
// const { seedPosts } = require("./seed");

// seedPosts();

// Require Routes
const indexRouter = require('./routes/index');
const postsRouter = require("./routes/postsRoute");
const reviewsRouter = require("./routes/reviewsRoute");

const User = require('./models/userModel');

const app = express();

// connect to datebase
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_DEV);
    console.log("MongoDB Connected");
}

// Engine
app.engine("ejs", engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set statics
app.use(express.static("public"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

// Sessions
app.use(
    session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: true
        // cookie: { secure: true }
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Configure Pasport and Sessions
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// local variable middleware
app.use((req, res, next)=> {
    // set user
    req.user = {
        _id: "6215d791ea6edfac7c5ce5d1",
        username: "test1"
    };
    res.locals.currentUser = req.user;

    // Set default Title
    res.locals.title = "Surf Shop";

    // Success and error sessions
    res.locals.success = req.session.success || "";
    delete req.session.success

    res.locals.error = req.session.error || "";
    delete req.session.error
    
    next();
});

// Routes
app.use('/', indexRouter);
app.use("/posts", postsRouter);
app.use("/posts/:id/reviews", reviewsRouter);

// error handler
app.use(function(err, req, res, next) {
    // // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // // render the error page
    // res.status(err.status || 500);
    // res.render('error');

    console.log(err);
    req.session.error = err.message;
    res.redirect("back");
});

app.listen(3000, ()=>{
    console.log("Server running on port: http://localhost:" + 3000);
});

module.exports = app;
