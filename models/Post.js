/* models/Post.js */
// DB에 글 정보 저장

var mongoose = require("mongoose");
var util = require("../util");

// 글 DB 스키마 정의
var postSchema = mongoose.Schema({
    title:{type:String, required:[true, "글 제목은 필수 항목입니다!"]},
    body:{type:String, required:[true, "글 내용은 필수 항목입니다!"]},
    author:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date},
},{
    toObject:{virtuals:true}
});

// virtuals (util.js에서 정의된 시간정보 출력 함수 사용)
postSchema.virtual("createdDate").get(function(){
    return util.getDate(this.createdAt);
});

postSchema.virtual("createdTime").get(function(){
    return util.getTime(this.createdAt);
});

postSchema.virtual("updatedDate").get(function(){
    return util.getDate(this.updatedAt);
});

postSchema.virtual("updatedTime").get(function(){
    return util.getTime(this.updatedAt);
});

// 모델 & export
var Post = mongoose.model("post", postSchema);
module.exports = Post;
