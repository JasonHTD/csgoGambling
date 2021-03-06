var User =  require("../models/user");

module.exports = function(req, res, next) {
if (req.body.resetCode) {
  next();
  return;
}
var user = {
  email: req.body.email,
};
User.sendResetCode(user, function(err) {
if (err) {
  res.locals.resetCodeNotSent = true;
  res.locals.errors.push(err);
  next();
  return;
}

res.locals.emailLink = user.email.split("@")[1];

res.locals.resetCodeSent = true;
next();
return;
})
};
