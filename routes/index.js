var express = require("express");
var router = express.Router();

var defaultVariables = require("../middlewares/defaultVariables")
var loadCSS = require("../middlewares/loadCSS");
var loadJS = require("../middlewares/loadJS");
var loadNavbar = require("../middlewares/loadNavbar");
var getCurrentPage = require("../middlewares/getCurrentPage");

router.use(defaultVariables);
router.use(loadNavbar);
router.use(getCurrentPage);
router.use(loadCSS([
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
  "/css/dist/all.min.css"
]));
router.use(loadJS([
  "https://code.jquery.com/jquery-3.2.1.min.js",
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
]));

router.get("/", function(req, res, next) {

res.redirect("/landing")

});

router.get("/p", function(req, res, next) {

res.render("registerEmailConfirmSuccess");

});

router.use("/landing", require("./landing"));
router.use("/login", require("./login"));
router.use("/register", require("./register"));
router.use("/password-reset", require("./passwordReset"));
router.use("/home", require("./home"));
router.use("/crates", require("./crates"));
router.use("/ajax", require("./ajax"));
router.use("/logout", require("./logout"));

module.exports = router;
