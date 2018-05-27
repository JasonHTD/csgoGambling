var Utilities = require("../models/utilities");
var Crate = require("../models/crate");
module.exports = function(req, res, next) {
  url = req.url.split("/")[1];
  url2 = req.url.split("/")[2];
  if (url.charAt(url.length - 1) == "?") {
    url = url.substring(0, url.length - 1);
  }
  if (url=="crates"&&Number.isInteger(parseInt(url2))) {
    var crateid = parseInt(url2);
    Crate.getName(crateid, function(err, crateName) {
      res.locals.currentPage = crateName;
    });
  }
  else {
    res.locals.currentPage = Utilities.linkToTitle(url);
    var index = res.locals.navbar.indexOf(res.locals.navbar.find(function(e) { return e.title == res.locals.currentPage; }));
    if (res.locals.navbar[index]) {
      res.locals.navbar[index].selected == true;
    }
  }
  res.locals.title = res.locals.currentPage;
  next();
}
