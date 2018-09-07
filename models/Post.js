/* models/Post.js */
// DB에 글 정보 저장

var mongoose = require("mongoose");

// 글 DB 스키마 정의
var postSchema = mongoose.Schema({
    title:{type:String, required:true},
    body:{type:String},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date},
},{
    toObject:{virtuals:true}
});

// virtuals
postSchema.virtual("createdDate").get(function(){
    return getDate(this.createdAt);
});

postSchema.virtual("createdTime").get(function(){
    return getTime(this.createdAt);
});

postSchema.virtual("updatedDate").get(function(){
    return getDate(this.updatedAt);
});

postSchema.virtual("updatedTime").get(function(){
    return getTime(this.updatedAt);
});

// 모델 & export
var Post = mongoose.model("post", postSchema);
module.exports = Post;

// functions
function getDate(dateObj){
    if(dateObj instanceof Date)
    return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1) + "-" + get2digits(dateObj.getDate());
}

function getTime(dateObj){
    if(dateObj instanceof Date)
    return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes()) + ":" + get2digits(dateObj.getSeconds());
}

function get2digits(num){
    return ("0"+num).slice(-2);
}