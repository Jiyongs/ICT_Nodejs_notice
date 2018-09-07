/* routes/home.js */
// 홈페이지 메인화면용 라우터

var express = require("express");
var router  = express.Router();
var passport = require("../config/passport")

// Home
router.get("/", function(req, res){
  res.render("home/welcome");
});
router.get("/about", function(req, res){
  res.render("home/about");
});
router.get("/board", function(req, res){
  res.render("home/board");
});

// Login
router.get("/login", function (req,res) {
  var username = req.flash("username")[0];
  var errors = req.flash("errors")[0] || {};
  res.render("home/login", {
   username:username,
   errors:errors
  });
 });

 // Post Login (로그인 뷰용 라우터)
router.post("/login",
function(req,res,next){
 var errors = {};
 var isValid = true;
 if(!req.body.username){
  isValid = false;
  errors.username = "ID를 입력해주세요!";
 }
 if(!req.body.password){
  isValid = false;
  errors.password = "비밀번호를 입력해주세요!";
 }

 if(isValid){
  next();
 } else {
  req.flash("errors",errors);
  res.redirect("/login");
 }
},
passport.authenticate("local-login", {
 successRedirect : "/",
 failureRedirect : "/login"
}
));

// Logout (로그아웃용 라우터)
router.get("/logout", function(req, res) {
req.logout();
res.redirect("/");
});

module.exports = router;