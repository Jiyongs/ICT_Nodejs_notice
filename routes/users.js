/* routes/users.js */
// 회원가입용 라우터

var express = require("express");
var router  = express.Router();
var User = require("../models/User");
var util = require("../util");

    // Index
    router.get("/", util.isLoggedin, function(req, res){
        User.find({})  //{}=모든 값 (찾을 조건)
        .sort({username:1}) //username 기준 오름차순 정렬
        .exec(function(err, users){  //callback 함수
             if(err) return res.json(err);
             res.render("users/index", {users:users});
            });
        });
   
   // New ()
   router.get("/new", function(req, res){
    var user = req.flash("user")[0] || {};  //error flash가 없으므로, 빈배열의 0번째를 받아옴
    var errors = req.flash("errors")[0] || {};
    res.render("users/new", {user:user, errors:errors});
   });
   
   // create (회원가입)
   router.post("/", function(req, res){
    User.create(req.body, function(err, user){
     if(err) {
         req.flash("user", req.body);
         req.flash("errors", util.parseError(err));
         return res.redirect("/users/new");  //user 생성시 발생한 오류 flash 전달
     }
     res.redirect("/users");
    });
   });
   
   // show ()
   router.get("/:username", util.isLoggedin, function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
     if(err) return res.json(err);
     res.render("users/show", {user:user});
    });
   });
   
   // edit ()
   router.get("/:username/edit", util.isLoggedin, checkPermission, function(req, res){
    var user = req.flash("user")[0];
    var errors = req.flash("errors")[0] || {};
    if(!user){
     User.findOne({username:req.params.username}, function(err, user){
      if(err) return res.json(err);
      res.render("users/edit", { username:req.params.username, user:user, errors:errors });
     });
    } else {
     res.render("users/edit", { username:req.params.username, user:user, errors:errors });
    }
   });   
   
   // update (회원 정보 수정)
   router.put("/:username", util.isLoggedin, checkPermission, function(req, res, next){
    User.findOne({username:req.params.username})
    .select({password:1})  //DB에서 password 항목을 선택하여 읽어옴(스키마 정의시 select가 false였기 때문)
    .exec(function(err, user){
     if(err) return res.json(err);
   
     // update user object
     user.originalPassword = user.password;
     user.password = req.body.newPassword? req.body.newPassword : user.password;
     for(var p in req.body){  
      user[p] = req.body[p];  //user = DB의 data, req.body = 폼에서 입력한 값
     }
   
     // save updated user
     user.save(function(err, user){
        if(err){
         req.flash("user", req.body);
         req.flash("errors", util.parseError(err));
         return res.redirect("/users/"+req.params.username+"/edit");
        }
        res.redirect("/users/"+req.params.username);
        });
    });
});
   
module.exports = router;

// private functions
// 조회한 회원정보 id==로그인한 회원의 id? 확인 함수
function checkPermission(req, res, next){
    User.findOne({username:req.params.username}, function(err, user){
     if(err) return res.json(err);
     if(user.id != req.user.id) return util.noPermission(req, res);
   
     next();
    });
}