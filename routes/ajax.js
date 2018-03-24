var express = require("express");
var router = express.Router();
var Crate = require("../models/crate");

router.get("/", function(req, res, next){

});
router.post("/", function(req, res, next){
  switch(req.body.ajaxid) {
    case "openCrate":
    var crateid = req.body.crateid
    Crate.open(req.session.username, crateid, function(err, item){
      res.json(item);
      return;
    });
    break;
  }
});

module.exports = router;
