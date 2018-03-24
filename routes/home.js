var express = require("express");
var router = express.Router();

var loadCSS = require("../middlewares/loadCSS");
var loadJS = require("../middlewares/loadJS");
var checkLoggedIn = require("../middlewares/checkLoggedIn")

router.use(checkLoggedIn);

router.use(loadCSS([
  "css/dist/home.min.css"
]));

router.use(loadJS([
]));

router.get("/", function(req, res, next){
  res.render("home");

});


module.exports = router;
