var db = require("../db");
var bcrypt = require("bcryptjs");
var Utilities = require("./utilities");
var mailgun = require("mailgun-js")({apiKey: "key-8c05606a31b48b6277dd6739685c7179", domain: "sandboxef6e5a150f08450e968b0ddd4ab6ca4e.mailgun.org"});
var fs = require("fs");

var user = function() {

}


user.login = function(user, callback) {

  if (user.username.length == 0 || user.password.length == 0) {
    callback(null, false);
    return;
  }

  if (user.username.length > 26) {
    callback(null, false);
    return;
  }

  db.pool.getConnection(function(err, connection) {
    if (err) {
      callback(err);
      return;
    }
    connection.query("SELECT username, password FROM members WHERE username = ?", [user.username], function(err, rows, fields) {
      connection.release();
      if (err) {
        callback(err);
        return;
      }
      if (rows.length == 0) {
        callback(null, false);
        return;
      }
      var phash = rows[0].password;
      bcrypt.compare(user.password, phash, function(err, result) {
        if (err) {
          callback(err);
          return;
        }
        if (!result) {
          callback(null, false);
          return;
        }
        callback(null, true);
        return;
      });
    });
  });
}

user.register = function(registrant, callback) {

  for(var prop in registrant) {
    if (typeof registrant[prop] === "undefined" || registrant[prop] == "") {
      callback(null, false);
      return;
    }
  }

  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(registrant.email)) {
    callback(null, false);
    return;
  }

  if (registrant.username.length > 26) {
    callback(null, false);
    return;
  }

  if (registrant.password != registrant.passwordConfirm) {
    callback(null, false);
    return;
  }

  if (registrant.age < 0||registrant.age > 150) {
    callback(null, false);
    return;
  }

  db.pool.getConnection(function(err, connection) {
    if (err) {
      callback(err);
      return;
    }
    connection.query("SELECT username FROM members WHERE username = ?", [registrant.username], function(err, rows, fields) {
      if (err) {
        connection.release();
        callback(err);
        return;
      }
      if (rows.length > 0) {
        connection.release();
        callback(null, false);
        return;
      }

      connection.query("SELECT email FROM members WHERE email = ?", [registrant.email], function(err, rows, fields) {
        if (err) {
          connection.release();
          callback(err);
          return;
        }
        if (rows.length > 0) {
          connection.release();
          callback(null, false);
          return;
        }

        bcrypt.hash(registrant.password, 13, function(err, hash) {
          if (err) {
            connection.release();
            callback(err);
            return;
          }

          Utilities.generateRandomString(32, function(string) {
            connection.query("INSERT INTO `members`(`username`, `password`, `email`, `age`, `firstName`, `lastName`, `emailConfirmCode`) VALUES (?, ?, ?, ?, ?, ?, ?)", [registrant.username, hash, registrant.email, registrant.age, registrant.firstName, registrant.lastName, string], function(err, rows, fields) {
              connection.release();
              if (err) {
                callback(err);
                return;
              }

              var mailData = {
                from: "noreply <noreply@csgogambling.com>",
                to: registrant.email,
                subject: "Account Verification",
                text: "http://localhost:3000/register?emailConfirmCode="+string
              };

              mailgun.messages().send(mailData, function(err, body){

                if (err) {
                  callback(err);
                  return;
                }
                callback(null, true);
                return;
              });
            });
          });
        });
      });
    });
  });
}

user.confirmEmail = function(user, callback) {

db.pool.getConnection(function(err, connection){
  if (err) {
    callback(err);
    return;
  }
  connection.query("SELECT emailConfirmCode FROM members WHERE emailConfirmCode = ?", [user.emailConfirmCode], function(err, rows, fields){
    if (err) {
      callback(err);
      return;
    }
    if (rows.length == 0) {
      callback("Invalid confirm code");
      return;
    }
    connection.query("UPDATE members SET emailConfirmCode = NULL WHERE BINARY emailConfirmCode = ?", [user.emailConfirmCode], function(err, rows, fields){
      if (err) {
        callback(err);
        return;
      }
      callback(null);
      return;
    });
  });
});

}

module.exports = user;
