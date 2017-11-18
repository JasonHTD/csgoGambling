var express = require("express");
var router = express.Router();

var loadCSS = require("../middlewares/loadCSS");
var loadJS = require("../middlewares/loadJS");


router.use(loadCSS([
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
  "css/landing.css",
  "css/navbar.css",
  "css/login.css"
]));

router.use(loadJS([

]));

router.get("/", function(req, res, next){


res.render("landingLoggedOut");

});




module.exports = router;
