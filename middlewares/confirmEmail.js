var User = require("../models/user");

module.exports = function(req, res, next){
  if (!req.query.emailConfirmCode) {
    next();
    return;
  }
  User.confirmEmail({
    emailConfirmCode: req.query.emailConfirmCode
  }, function(err){
    if (err) {
      res.locals.errors.push(err);
      next();
      return;
    }
    res.locals.emailConfirmed = true;
    next();
    return;
  })
}
