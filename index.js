/* /index.js */

var express        = require("express");
var mongoose       = require("mongoose");
var bodyParser     = require("body-parser");
var methodOverride = require("method-override");
var app = express();

// DB setting
mongoose.connect("mongodb://localhost:27017/ict_w1", { useNewUrlParser: true });
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected");
});
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// Routes
app.use("/", require("./routes/home"));        //메인 화면 띄우기 라우터
app.use("/posts", require("./routes/posts"));  //게시물 CRUD 관련 라우터
app.use("/users", require("./routes/users"));  //회원가입 라우터

// Port setting
var port = 3000
app.listen(port, function(){
  console.log("server on! http://localhost:"+port);
});