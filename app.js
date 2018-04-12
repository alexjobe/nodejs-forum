var express        = require("express"),
    app            = express(),
    dotenv         = require('dotenv').config(),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    User           = require("./models/user");

// APP CONFIG
mongoose.connect(process.env.DB_URL);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

// REQUIRE ROUTES
var indexRoutes = require("./routes/index");
var topicRoutes = require("./routes/topics");
var postRoutes = require("./routes/posts");
var commentRoutes = require("./routes/comments");

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "It’s not a story the Jedi would tell you",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// USE ROUTES
app.use(indexRoutes);
app.use("/topics", topicRoutes);
app.use("/topics/:topic_id/posts", postRoutes);
app.use("/topics/:topic_id/posts/:post_id/comments", commentRoutes);

app.listen(3000, "localhost", function(){
    console.log("Forum server is listening");
});