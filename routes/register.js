var express = require("express");
var router = express.Router();

var loadCSS = require("../middlewares/loadCSS");
var loadJS = require("../middlewares/loadJS");
var validateRegistration = require("../middlewares/validateRegistration");
var confirmEmail = require("../middlewares/confirmEmail");
var checkLoggedOut = require("../middlewares/checkLoggedOut");

router.use(checkLoggedOut);

router.use(loadCSS([
  "css/dist/login.min.css"
]));

router.use(loadJS([
]));

router.get("/", confirmEmail, function(req, res, next){
if (res.locals.emailConfirmed) {
  res.render("registerEmailConfirmSuccess");
}
else {
  res.render("register");
}


});

router.post("/", validateRegistration, function(req, res, next){
if (res.locals.validRegistration) {
  res.render("registerSuccess");
}
else {
  res.render("register");
}
});

module.exports = router;
