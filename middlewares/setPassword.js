var User = require("../models/user");

module.exports = function(req, res, next) {
  if (res.locals.resetCodeSent) {
    next();
    return;
  }

  var resetCode = req.body.resetCode;
  var password = req.body.password;
  var passwordConfirm = req.body.passwordConfirm;

  if (password != passwordConfirm) {
    res.locals.errors.push("Passwords do not match");
    next();
    return;
  }

  else if (password < 1) {
    res.locals.errors.push("Make ur password longer dumby");
    next();
    return;
  }

  var user = {
    password: password,
    resetCode: resetCode
  };

  User.setPassword(user, function(err) {
    if (err) {
      console.log(err);
      res.locals.errors.push(err)
      next();
      return;
    }
    res.locals.passwordUpdated = true;
    next();
    return;
  })
}
