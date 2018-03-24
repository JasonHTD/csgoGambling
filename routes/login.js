var express = require("express");
var router = express.Router();

var loadCSS = require("../middlewares/loadCSS");
var loadJS = require("../middlewares/loadJS");
var validateLogin = require("../middlewares/validateLogin");
var checkLoggedOut = require("../middlewares/checkLoggedOut");

router.use(checkLoggedOut);

router.use(loadCSS([
  "css/dist/login.min.css"
]));

router.use(loadJS([
]));

router.get("/", function(req, res, next){
  res.render("login");

});

router.post("/", validateLogin, function(req, res, next){
  if (res.locals.validLogin) {
    res.redirect("/home");
  }
  else {
    res.render("login");
  }
});




module.exports = router;
