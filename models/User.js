/* models/User.js */
// DB에 사용자 정보 저장

var mongoose = require("mongoose"); //DB
var bcrypt = require("bcrypt-nodejs"); //hash-password

// 사용자 스키마 정의
var userSchema = mongoose.Schema({
 username:{
     type:String,
     required:[true,"id는 필수 항목입니다!"],
     matche:[/^.{4,12}$/,"4-12자리로 입력하세요!"], //문자열 제한 x, 글자수 제한 4~12자리
     trim:true,  //문자열 앞, 뒤 공백을 제거
     unique:true
    },
 password:{
     type:String,
     required:[true,"password는 필수 항목입니다!"],
     select:false
},
 name:{
     type:String,
     required:[true,"이름은 필수 항목입니다!"],
     trim:true
    },
 email:{
     type:String,
     match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,"email 형식에 맞게 입력해주세요!"],
     trim:true
    }
},{
 toObject:{virtuals:true}
});

// virtuals (db에 저장되지 않아도 되는 값들을 처리)
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });

// password validation (값의 유효성 검사)
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;  //비밀번호 형식 제한 설정
var passwordRegexErrorMessage = "숫자와 영문자를 조합한 6-16자리로 입력해주세요!";
userSchema.path("password").validate(function(v) {
 var user = this; //this=user model

 // create user
 // 새 user 생성하는 경우
 if(user.isNew){
  if(!user.passwordConfirmation){ //패스워드 확인란 미 작성시
   user.invalidate("passwordConfirmation", "비밀번호 미입력!");
  }
  if(!passwordRegex.test(user.password)){ //패스워드 조건 미충족시
    user.invalidate("password", passwordRegexErrorMessage);
  }
  else if(user.password !== user.passwordConfirmation) { //패스워드 확인란 오류시
   user.invalidate("passwordConfirmation", "비밀번호 확인란 오류!");
  }
 }

 // update user
 // user 정보를 수정하는 경우
 if(!user.isNew){
  if(!user.currentPassword){ //현재 패스워드 미 작성시
   user.invalidate("currentPassword", "현재 비밀번호를 작성하세요");
  }
  if(user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)){ //패스워드 작성시&&저장된hash비번과 입력된hash비번 불일치
   user.invalidate("currentPassword", "현재 비밀번호가 맞지 않습니다");
  }
  if(user.newPassword && !passwordRegex.test(user.newPassword)){ // 새 패스가 패스워드 조건 미충족시
    user.invalidate("newPassword", passwordRegexErrorMessage);
  }
  else if(user.newPassword !== user.passwordConfirmation) { //새 패스워드와 확인란이 맞지 않을시
   user.invalidate("passwordConfirmation", "비밀번호 확인란이 맞지 않습니다");
  }
 }
});

// hash password
userSchema.pre("save", function (next){ //유저 생성 및 수정의 save 이벤트 실행 전 callback함수 실행
    var user = this;
    if(!user.isModified("password")){ //password 변경이 X는 경우
     return next();
    } else {
     user.password = bcrypt.hashSync(user.password); //password 변경 O는 경우, 새로운 hash-pw 생성
     return next();
    }
   });
   
   // model methods
   userSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt.compareSync(password,user.password);
   };

// model & export
var User = mongoose.model("user",userSchema);
module.exports = User;