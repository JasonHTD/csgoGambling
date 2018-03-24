var express = require("express");
var router = express.Router();

var loadCSS = require("../middlewares/loadCSS");
var loadJS = require("../middlewares/loadJS");

router.use(loadCSS([
  "css/dist/landing.min.css"
]));

router.use(loadJS([

]));

router.get("/", function(req, res, next){

res.render("landing");

});




module.exports = router;
