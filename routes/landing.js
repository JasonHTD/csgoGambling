var express = require("express");
var router = express.Router();

var loadCSS = require("../middlewares/loadCSS");
var loadJS = require("../middlewares/loadJS");


router.use(loadCSS([
  "css/landing.css",
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
]));

router.use(loadJS([

]));

router.get("/", function(req, res, next){


res.render("landing");

});




module.exports = router;
