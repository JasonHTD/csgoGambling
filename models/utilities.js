var utilities = {};


utilities.generateRandomString = function(numChars, callback) {
  var characters = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ1234567890";
  var hash = "";
  for (var i = 0; i < numChars; i++) {
    hash += characters.charAt(Math.floor(Math.random()*characters.length));
  }
  callback(hash);
  return;
}





module.exports = utilities;
