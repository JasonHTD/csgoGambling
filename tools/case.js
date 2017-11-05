var crate = require("../models/crate");

crate.open(1, function(err) {

if (err) {
console.log(err);
}

})
