var Crate = require("../models/crate")
var replicates = 10000;
var incidence = [0, 0, 0, 0];
var totalPrice = 0;
var counter = 0;
for (var i = 0; i < replicates; i++) {
  Crate.open("username", 2, function(err, item) {
    counter++
    totalPrice += item.price

    if (counter == replicates) {
      stats();
    }
    return;
  })
}

function stats(){
  var expectedValue = totalPrice/replicates;
  console.log(expectedValue)
}
