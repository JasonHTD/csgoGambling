var Crate = require("../models/crate");


module.exports = function(req, res, next) {
Crate.list(function(err, crates) {
  if (err) {
    callback(err);
  }
  res.locals.crates = crates;
  next();
});
}
