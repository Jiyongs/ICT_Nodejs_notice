/* config/passport.js */
// 로그인 기능

var passport   = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User     = require("../models/User");

// serialize & deserialize User
// login시, DB의 user를 session에 저장하는 방법 설정
passport.serializeUser(function(user, done) {
 done(null, user.id);
});
// request시, session에서 user object를 만드는 방법 설정
passport.deserializeUser(function(id, done) {
 User.findOne({_id:id}, function(err, user) {
  done(err, user);
 });
});

// local strategy
passport.use("local-login",
 new LocalStrategy({
   usernameField : "username",
   passwordField : "password",
   passReqToCallback : true
  },
  function(req, username, password, done) { // 로그인시 호출되는 함수
   User.findOne({username:username})
   .select({password:1})
   .exec(function(err, user) {
    if (err) return done(err);

    if (user && user.authenticate(password)){ // 입력받은 pw와 db의 pw-hash를 비교하는 함수
     return done(null, user);
    } else {
     req.flash("username", username);
     req.flash("errors", {login:"ID 또는 비밀번호가 맞지 않습니다."});
     return done(null, false);
    }
   });
  }
 )
);

module.exports = passport;