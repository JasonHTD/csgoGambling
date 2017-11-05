var express = require("express");
var router = express.Router();

var loadCSS = require("../middlewares/loadCSS");
var loadJS = require("../middlewares/loadJS");

router.use(loadCSS([
]));

router.use(loadJS([
]));

router.get("/", function(req, res, next){

  if (res.locals.validResetCode) {
    res.render("passwordResetForm")
  }
  else {
    res.render("passwordResetRequest");
  }
});

router.post("/", function(req, res, next){

  if (req.body.resetCode) {
    if (res.locals.passwordUpdated) {
      res.render("passwordResetSuccess");
    }
    else {
      res.locals.resetCode = req.body.resetCode;
      res.render("passwordResetForm");
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
