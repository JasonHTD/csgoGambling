var db = require("../db");

var User = require("../models/user");

module.exports = function(req, res, next) {
  var registrant = {
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    email: req.body.email,
    age: req.body.age,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };
  User.register(registrant, function(err, validRegistration){
    if (err) {
      res.locals.errors.push(err);
      res.locals.validRegistration = false;
      next();
      return;
    }
    if (!validRegistration) {
      res.locals.errors.push(err);
      res.locals.validRegistration = false;
      next();
      return;
    }
    res.locals.emailLink = registrant.email.split("@")[1];

    res.locals.validRegistration = true;
    next();
    return;
  });
  return;
};
