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

utilities.linkToTitle = function(link) {
  switch (link) {
    case "home":
    return "Home";
    break;
    case "crates":
    return "Cases";
    break;
    case "inventory":
    return "Inventory";
    break;
    case "deposit":
    return "Deposit";
    break;
    case "withdraw":
    return "Withdraw";
    break;
    case "logout":
    return "Logout";
    break;
    case "login":
    return "Login";
    break;
    case "password-reset":
    return "Password Reset";
    break;
    case "register":
    return "Register";
    break;
    case "landing":
    return "Landing";
    break;

    default:
    return "N/A";
  }
}



module.exports = utilities;
