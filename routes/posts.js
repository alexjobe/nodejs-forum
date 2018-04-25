var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/post");
var Topic = require("../models/topic");
var middleware = require("../middleware");

//==========================================//
//                POST ROUTES               //
//          /topics/:topic_id/posts         //
//==========================================//

// INDEX - Show all posts
router.get("/", function(req, res){

    Topic.findById(req.params.topic_id).populate("posts").exec(function(err, topic){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("posts/index", {topic: topic, page: 1});
        }
    });

});

// INDEX - Show posts on a given page
router.get("/page/:page_num", function(req, res){

    Topic.findById(req.params.topic_id).populate("posts").exec(function(err, topic){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("posts/index", {topic: topic, page: req.params.page_num});
        }
    });

});

// CREATE - Add new post to database
router.post("/", middleware.isLoggedIn, function(req, res){

    Topic.findById(req.params.topic_id, function(err, topic){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            Post.create(req.body.post, function(err, post){
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    // Add username and id to post
                    post.author.id = req.user._id;
                    post.author.username = req.user.username;
                    // Save post, add to topic, and save topic
                    post.save()
                    topic.posts.push(post);
                    topic.save();
                    req.flash("success", "Your post was successfully created!");
                    res.redirect("/topics/" + req.params.topic_id + "/posts");
                }
            });
        }

    });
});

// NEW - Show form to create new post
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("posts/new", {topic_id: req.params.topic_id});
});

// SHOW - Show a single post
router.get("/:post_id", function(req, res){
    Post.findById(req.params.post_id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("posts/show", {topic_id: req.params.topic_id, post: foundPost});
        }
    });
});

// EDIT - Show form to edit an existing post
router.get("/:post_id/edit", middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.post_id, function(err, foundPost){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("posts/edit", {topic_id: req.params.topic_id, post: foundPost});
        }
    });
});

// UPDATE - Update an existing post
router.put("/:post_id", middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndUpdate(req.params.post_id, req.body.post, function(err, updatedPost){
        if(err){
            console.log(err);
            res.redirect("/topics/" + req.params.topic_id +"/posts/");
        } else {
            req.flash("success", "Your post was successfully changed!");
            res.redirect("/topics/" + req.params.topic_id + "/posts/" + req.params.post_id);
        }
    });
});

// DELETE - Remove an existing post
router.delete("/:post_id", middleware.checkPostOwnership, function(req, res){

    Post.findByIdAndRemove(req.params.post_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/topics/" + req.params.topic_id + "/posts/");
        } else {
            req.flash("success", "Your post was successfully removed!");
            res.redirect("/topics/" + req.params.topic_id + "/posts/");
        }
    });
});

module.exports = router;