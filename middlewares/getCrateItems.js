var Crate = require("../models/crate");

module.exports = function(req, res, next) {
  Crate.getItems(req.params.crateid, function(err, items) {
    if (err) {
      res.locals.errors.push(err);
      next();
    }
    res.locals.items = items;
    next();
  })
}
