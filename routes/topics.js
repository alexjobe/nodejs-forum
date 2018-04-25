var express = require("express");
var router  = express.Router();
var Topic = require("../models/topic");
var middleware = require("../middleware");

//==========================================//
//                TOPIC ROUTES              //
//                  /topics                 //
//==========================================//

// INDEX - Show all topics
router.get("/", function(req, res){
    Topic.find({}, function(err, allTopics){
        if(err){
            console.log(err);
        } else {
            res.render("topics/index", {topics: allTopics});
        }
    });
});

// CREATE - Add new topic to database
router.post("/", middleware.checkAdmin, function(req, res){
    Topic.create(req.body.topic, function(err, addedTopic){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "The topic was successfully created!");
            res.redirect("/topics");
        }
    });
});

// NEW - Show form to create new topic
router.get("/new", middleware.checkAdmin, function(req, res){
    res.render("topics/new");
});

// EDIT - Show form to edit an existing topic
router.get("/:topic_id/edit", middleware.checkAdmin, function(req, res){
    Topic.findById(req.params.topic_id, function(err, topic){
        if(err || !topic){
            req.flash("error", "Topic not found");
            res.redirect("back");
        } else {
            res.render("topics/edit", {topic: topic});
        }
    });
});

// UPDATE - Update an existing topic
router.put("/:topic_id", middleware.checkAdmin, function(req, res){
    Topic.findByIdAndUpdate(req.params.topic_id, req.body.topic, function(err, updatedTopic){
        if(err){
            console.log(err);
            res.redirect("/topics");
        } else {
            req.flash("success", "The topic was successfully changed!");
            res.redirect("/topics");
        }
    });
});

// DELETE - Remove an existing topic
router.delete("/:topic_id", middleware.checkAdmin, function(req, res){

    Topic.findByIdAndRemove(req.params.topic_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/topics");
        } else {
            req.flash("success", "The topic was successfully removed!");
            res.redirect("/topics");
        }
    });
});

module.exports = router;