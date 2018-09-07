/* routes/users.js */
// 회원가입용 라우터

var express = require("express");
var router  = express.Router();
var User = require("../models/User");

    // Index
    router.get("/", function(req, res){
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
         req.flash("errors", parseError(err));
         return res.redirect("/users/new");  //user 생성시 발생한 오류 flash 전달
     }
     res.redirect("/users");
    });
   });
   
   // show ()
   router.get("/:username", function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
     if(err) return res.json(err);
     res.render("users/show", {user:user});
    });
   });
   
   // edit ()
   router.get("/:username/edit", function(req, res){
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
   router.put("/:username",function(req, res, next){
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
         req.flash("errors", parseError(err));
         return res.redirect("/users/"+req.params.username+"/edit");
        }
        res.redirect("/users/"+user.username);  });
      });
     });
   
module.exports = router;

// Functions
// mongoose의 에러와 mongoDB의 에러의 형태를 통일시키는 함수
function parseError(errors){
    var parsed = {};
    if(errors.name == 'ValidationError'){
     for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
     }
    } else if(errors.code == "11000" && errors.errmsg.indexOf("username") > 0) {
     parsed.username = { message:"중복된 ID가 존재합니다!" };
    } else {
     parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
   }