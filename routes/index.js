var express = require("express");
var router = express.Router();

var loadCSS = require("../middlewares/loadCSS");
var loadJS = require("../middlewares/loadJS");

router.use(loadCSS([
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
]));

router.use(loadJS([
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
]));

router.get("/", function(req, res, next) {

res.redirect("landing")

});

router.use("/landing", require("./landing"));
router.use("/login", require("./login"));
router.use("/register", require("./register"));
router.use("/password-reset", require("./passwordReset"))


module.exports = router;
