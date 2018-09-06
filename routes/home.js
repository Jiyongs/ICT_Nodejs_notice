/* routes/home.js */

var express = require("express");
var router  = express.Router();

// Home
router.get("/", function(req, res){
  res.render("home/welcome");
});
router.get("/about", function(req, res){
  res.render("home/about");
});
// 추가
router.get("/board", function(req, res){
  res.render("home/board");
});

module.exports = router;