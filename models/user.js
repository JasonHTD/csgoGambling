var db = require("../db");
var bcrypt = require("bcryptjs");
var Utilities = require("./utilities");
var mailgun = require("mailgun-js")({apiKey: "key-8c05606a31b48b6277dd6739685c7179", domain: "sandboxef6e5a150f08450e968b0ddd4ab6ca4e.mailgun.org"});
var fs = require("fs");
var handlebars = require("handlebars");
var config = require("../config");

var user = function() {

}


user.login = function(user, callback) {

  if (user.username.length == 0 || user.password.length == 0) {
    callback("Username or Password not entered.", false);
    return;
  }

  if (user.username.length > 26) {
    callback("Username must be less than 27 characters.", false);
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
        callback("Incorrect Username", false);
        return;
      }
      var phash = rows[0].password;
      bcrypt.compare(user.password, phash, function(err, result) {
        if (err) {
          callback(err);
          return;
        }
        if (!result) {
          callback("Incorrect Password", false);
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
      callback("Not all fields are filled in.", false);
      return;
    }
  }

  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(registrant.email)) {
    callback("Inproper Email Format", false);
    return;
  }

  if (registrant.username.length > 26) {
    callback("Username must be less than 27 characters.", false);
    return;
  }

  if (registrant.password != registrant.passwordConfirm) {
    callback("The two passwords did not match.", false);
    return;
  }

  if (registrant.password.length < 8) {
    callback("Password must be greater than 7 characters", false);
    return;
  }

  if (registrant.age < 19||registrant.age > 99) {
    callback("You must be between 19 and 99 years of age to enter.", false);
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
        callback("Username has already been taken. YooiiiNk", false);
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
          callback("Email has already been used.", false);
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

user.checkResetCode = function(user, callback) {
  db.pool.query("SELECT passwordResetCode FROM members WHERE passwordResetCode = ?", [user.resetCode], function(err, rows, fields){
    if (err) {
      throw "Error accessing members table";
    }
    if (rows.length == 1) {
      callback(null);
      return;
    }
    callback("Invalid reset code");
    return;
  });
}
user.sendResetCode = function(user, callback) {
  Utilities.generateRandomString(32, function(hash) {
    db.pool.query("UPDATE members SET passwordResetCode = ? WHERE email = ?", [hash, user.email], function(err, rows, fied){
      if (err) {
        throw "Error accessing members table";
      }
      else if (rows.affectedRows = 0) {
        callback("Email could not be found");
        return;
      }
      db.pool.query("SELECT username FROM members WHERE email = ?", [user.email], function(err, rows, field) {
        if (err) {
          throw "Error accessing members table"
        }
        if (rows.length == 0) {
          callback("Incorrect Email");
          return;
        }
        fs.readFile("./views/mail/resetPassword.hbs", function(err, data) {
          if (err) {
            throw "Cannot access /views/mail/resetPassword.hbs";
          }
          var htmlTemplate = handlebars.compile(data.toString());
          var handlebarsData = {
            username: rows[0].username,
            url: "http://"+config.host+"/password-reset?resetCode="+hash+"",
          };
          var html = htmlTemplate(handlebarsData);
          var mailData = {
            from: config.mail.name+" <"+config.mail.email+">",
            to: user.email,
            subject: "Password Reset Code",
            text: "Hello "+handlebarsData.username+" here is your password reset code: "+handlebarsData.url,
            html: html,
          };
          mailgun.messages().send(mailData, function(err, body) {
            if (err) {
              callback("Error sending password reset email");
              return;
            }
            callback(null);
            return;
          });
        });
      });
    });
  });
};

user.setPassword = function(user, callback) {
  if (user.resetCode) {
    bcrypt.hash(user.password, config.hashComplexity, function(err, hash) {
      if (err) {
        callback(err);
        return;
      }
      db.pool.query("UPDATE members SET password = ?, passwordResetCode = NULL WHERE passwordResetCode = ?", [hash, user.resetCode], function(err, rows, fields) {
        if (err) {
          callback(err);
          return;
        }
        if (rows.affectedRows!= 0) {
          callback(null);
          return;
        }
        callback("Server Error")
        return;
      });
    });
  }
}

module.exports = user;
