var Utilities = require("../models/utilities");
var Crate = require("../models/crate");
module.exports = function(req, res, next) {
  if (req.url.split("/")[1]=="crates"&&Number.isInteger(parseInt(req.url.split("/")[2]))) {
    var crateid = parseInt(req.url.split("/")[2]);
    Crate.getName(crateid, function(err, crateName) {
      res.locals.currentPage = crateName;
    });
  }
  else {
    res.locals.currentPage = Utilities.linkToTitle(req.url.split("/")[1]);
    res.locals.navbar[res.locals.navbar.indexOf(res.locals.navbar.find(function(e) { return e.title == res.locals.currentPage; }))].selected = true;
  }
  res.locals.title = res.locals.currentPage;
  next();
}
