var crate = require("../models/crate");

crate.create({crateName: "Test Crate 2"}, [1, 2, 3, 4], function(err) {

if (err) {
console.log(err);
}

})
