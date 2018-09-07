/* routes/posts.js */
// 게시판용 라우터

var express = require("express");
var router  = express.Router();
var Post = require("../models/Post");

//Index
router.get("/", function(req, res){
    Post.find({})
    .sort("-createAt")             //sort()를 이용해 오름차순 정렬 설정함 /db에서 데이터를 찾는 방법, 데이터의 정렬방법
    .exec(function(err, posts){    //해당 데이터를 받아와서 할 일을 정하는 부분
        if(err) return res.json(err);
        res.render("posts/index", {posts:posts});
    })
})

//New 
router.get("/new", function(req, res){
    res.render("posts/new");
});

// create
router.post("/", function(req, res){
    Post.create(req.body, function(err, post){
     if(err) return res.json(err);
     res.redirect("/posts");
    });
   });

// Show
router.get("/:id", function(req, res){
    Post.findOne({_id:req.params.id}, function(err, post){
     if(err) return res.json(err);
     res.render("posts/show", {post:post});
    });
   });
   
// Edit
   router.get("/:id/edit", function(req, res){
    Post.findOne({_id:req.params.id}, function(err, post){
     if(err) return res.json(err);
     res.render("posts/edit", {post:post});
    });
   });
   
// Update
   router.put("/:id", function(req, res){
    req.body.updatedAt = Date.now(); // 2
    Post.findOneAndUpdate({_id:req.params.id}, req.body, function(err, post){
     if(err) return res.json(err);
     res.redirect("/posts/"+req.params.id);
    });
   });
   
// Destroy
   router.delete("/:id", function(req, res){
    Post.remove({_id:req.params.id}, function(err){
     if(err) return res.json(err);
     res.redirect("/posts");
    });
   });   

module.exports = router;