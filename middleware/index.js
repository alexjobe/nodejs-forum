var Topic = require("../models/topic");
var Post = require("../models/post");
var Comment = require("../models/comment");

// An object to hold all middleware
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkPostOwnership = function(req, res, next) {
    // Is user logged in?
    if(req.isAuthenticated()){
        Post.findById(req.params.post_id, function(err, foundPost){
            if(err || !foundPost){
                req.flash("error", "Post not found");
                res.redirect("back");
            } else {
                // Does user own the post?
                if(foundPost.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // Is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // Does user own the comment?
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkAdmin = function(req, res, next) {
    // Is user logged in?
    if(req.isAuthenticated()){
        // Is user an admin?
        if(req.user.isAdmin){
            next();
        } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
        }
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;

