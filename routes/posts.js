/* routes/posts.js */
// 게시판용 라우터

var express = require("express");
var router  = express.Router();
var Post = require("../models/Post");
var util = require("../util");

//Index
router.get("/", function(req, res){
    Post.find({})
    .populate("author")            //relationship이 형성된 항목 값(user의 id)을 author에 가져옴
    .sort("-createAt")             //sort()를 이용해 오름차순 정렬 설정함 /db에서 데이터를 찾는 방법, 데이터의 정렬방법
    .exec(function(err, posts){    //해당 데이터를 받아와서 할 일을 정하는 부분
        if(err) return res.json(err);
        res.render("posts/index", {posts:posts});
    });
});

//New 
router.get("/new", util.isLoggedin, function(req, res){
    var post = req.flash("post")[0] || {};
    var errors = req.flash("errors")[0] || {};
    res.render("posts/new",{post:post, errors:errors});
});

// create
router.post("/", util.isLoggedin, function(req, res){
    req.body.author = req.user._id; // 글 작성시 req.user._id(passport.js에서 자동 생성되는 것)를 가져와 post의 author에 기록함
    Post.create(req.body, function(err, post){
     if(err){
         req.flash("post", req.body);
         req.flash("errors", util.parseError(err));
        return res.redirect("/posts/new");
     }
     res.redirect("/posts");
    });
   });

// Show
router.get("/:id", function(req, res){
    Post.findOne({_id:req.params.id})
    .populate("author")   //relationship이 형성된 항목 값(user의 id)을 author에 가져옴
    .exec(function(err, post){
     if(err) return res.json(err);
     res.render("posts/show", {post:post});
    });
   });
   
// Edit
   router.get("/:id/edit", util.isLoggedin, checkPermission, function(req, res){
       var post = req.flash("post")[0];
       var errors = req.flash("errors")[0] || {};
       if(!post){
        Post.findOne({_id:req.params.id}, function(err, post){
            if(err) return res.json(err);
            res.render("posts/edit", {post:post, errors:errors});
       });
    }else{
        post._id = req.params.id;
        res.render("posts/edit", { post:post, errors:errors});
    }
    });
   
// Update
   router.put("/:id", util.isLoggedin, checkPermission, function(req, res){
    req.body.updatedAt = Date.now();
    Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
     if(err) {
         req.flash("post", req.body);
         req.flash("errors", util.parseError(err));
         return res.redirect("/posts/"+req.params.id+"/edit");
     }
     res.redirect("/posts/"+req.params.id);
    });
   });
   
// Destroy
   router.delete("/:id", util.isLoggedin, checkPermission, function(req, res){
    Post.remove({_id:req.params.id}, function(err){
     if(err) return res.json(err);
     res.redirect("/posts");
    });
   });   

module.exports = router;

// private functions
// 해당 게시물의 작성자와 로그인된 id를 비교하는 함수
function checkPermission(req, res, next){
    Post.findOne({_id:req.params.id}, function(err, post){
     if(err) return res.json(err);
     if(post.author != req.user.id) return util.noPermission(req, res);
   
     next();
    });
}