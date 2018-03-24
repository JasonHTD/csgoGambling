var db = require("../db");

var User = require("../models/user");

module.exports = function(req, res, next) {
  var user = {
    username: req.body.username,
    password: req.body.password
  };
  User.login(user, function(err, validLogin){
    if (err) {
      res.locals.validLogin = false;
      next();
      return;
    }
    if (!validLogin) {
      res.locals.validLogin = false;
      next();
      return;
    }
    res.locals.validLogin = true;
    req.session.username = user.username;
    next();
    return;
  });
  return;
};
