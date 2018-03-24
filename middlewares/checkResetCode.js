var User = require("../models/user");

module.exports = function(req, res, next) {
  if (req.query.resetCode) {
    var user = {
      resetCode: req.query.resetCode,
    };
  User.checkResetCode(user, function(err) {
    if (err) {
      console.log(err);
      next();
      return;
    }
    res.locals.validResetCode = true;
    res.locals.resetCode = user.resetCode;
    next();
    return;
  });
}
  else {
    next();
    return;
  }
}
