var express = require("express");
var router = express.Router();

var getCrateName = require("../middlewares/getCrateName");
var loadCSS = require("../middlewares/loadCSS");
var loadJS = require("../middlewares/loadJS");
var getCrates = require("../middlewares/getCrates");
var  getCrateItems = require("../middlewares/getCrateItems");
var checkLoggedIn = require("../middlewares/checkLoggedIn");

router.use(checkLoggedIn);

router.use(loadCSS([
  "/css/dist/crates.min.css"
]));

router.use(loadJS([
]));


router.get("/", getCrates, function(req, res, next){
  res.render("crates");
});

router.get("/:crateid", getCrateName, getCrateItems, function(req, res, next){
  var crateid = req.params.crateid;
  res.locals.title = res.locals.crateName;
  res.locals.crateid = crateid;
  res.render("crate");
});

module.exports = router;
