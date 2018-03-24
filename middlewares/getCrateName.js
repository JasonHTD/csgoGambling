var Crate = require("../models/crate");

module.exports = function(req, res, next) {
  Crate.getName(req.params.crateid, function(err, crateName) {
    res.locals.crateName = crateName;
    next();
  });
}
