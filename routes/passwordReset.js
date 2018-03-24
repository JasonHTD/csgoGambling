var express = require("express");
var router = express.Router();

var loadCSS = require("../middlewares/loadCSS");
var loadJS = require("../middlewares/loadJS");
var checkResetCode = require("../middlewares/checkResetCode");
var sendResetCode = require("../middlewares/sendResetCode");
var setPassword = require("../middlewares/setPassword");
var checkLoggedOut = require("../middlewares/checkLoggedOut");

router.use(checkLoggedOut);

router.use(loadCSS([
]));

router.use(loadJS([
]));

router.get("/", checkResetCode, function(req, res, next) {
  if (res.locals.validResetCode) {
    res.render("passwordReset")
  }
  else {
    res.render("passwordResetRequest");
  }
});

router.post("/", sendResetCode, setPassword, function(req, res, next) {
  if (req.body.resetCode) {
    if (res.locals.passwordUpdated) {
      res.render("passwordResetSuccess");
    }
    else {
      res.locals.resetCode = req.body.resetCode;
      res.render("passwordReset");
    }
  }
  else {
    if (res.locals.resetCodeSent) {
      res.render("passwordResetSent");
    }
    else {
      res.render("passwordResetRequest");
    }
  }
});


module.exports = router;
