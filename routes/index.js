var express = require("express");
var User = require("../models/user");
var passport = require("passport");
var router  = express.Router();

router.get("/", function(req, res){
    res.render("home");
});

// Show login form
router.get("/login", function(req, res){
    res.render("login");
});

// Show login form
router.get("/login", function(req, res) {
    res.render("login"); 
 });
 
 // Handle login form
 router.post("/login", passport.authenticate("local", 
     {
        successFlash: "You have been successfully logged in!",
        failureFlash: true,
        successRedirect: "/topics", 
        failureRedirect: "/login"
     }), function(req, res) {
 });

// Show register form
router.get("/register", function(req, res){
    res.render("register");
});

// Handle register logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + newUser.username + "!");
            res.redirect("/topics");
        });
    });
});

// Logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have been logged out");
    res.redirect("/topics");
});

module.exports = router;