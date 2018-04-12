var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/post");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//==========================================//
//              COMMENT ROUTES              //
//   /topics/:topic_id/posts/:id/comments   //
//==========================================//

// CREATE - Add a new comment to post
router.post("/", middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.post_id, function(err, post){
        if(err){
            console.log(err);
            res.redirect("/topics/:topic_id/posts");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment, add to post, and save post
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    req.flash("success", "Your comment was successfully created!");
                    res.redirect("/topics/" + req.params.topic_id + "/posts/" + post._id);
                }
            });
        }
    });
});

// NEW - Show form to create a new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.post_id, function(err, post){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {topic_id: req.params.topic_id, post: post});
        }
    });
});

// EDIT - Show form to edit an existing comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {topic_id: req.params.topic_id, post_id: req.params.post_id, comment: foundComment});
        }
    });
});

// UPDATE - Update an existing comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Your comment was successfully changed!");
            res.redirect("/topics/" + req.params.topic_id + "/posts/" + req.params.post_id);
        }
    });
});

// DELETE - Remove an existing comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Your comment was successfully removed!");
            res.redirect("/topics/" + req.params.topic_id + "/posts/" + req.params.post_id);
        }
    });
});

module.exports = router;