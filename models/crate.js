var db = require("../db")
var config = require("../config")

var crate = function() {

}


crate.create = function(crate, items, callback){
  /*
  crate = {
  crateName: ,
  price:
}
items = [
]
*/
db.pool.query("SELECT itemid, price FROM items WHERE itemid IN (" + items.join() + ")", function(err, rows, fields){
  if (err) {
    callback(err);
    return;
  }
  if (items.length != rows.length) {
    callback(new Error("Item(s) do not exist in database."));
    return;
  }

  var itemObjects = [];
  for (var i = 0; i < rows.length; i++) {
    itemObjects.push({
      itemid: rows[i].itemid,
      price: rows[i].price
    });
  }
  var average = 0;
  for (var i = 0; i < itemObjects.length; i++) {
    average += itemObjects[i].price;
  }
  average /= itemObjects.length;
  var reciprocalPrice = []
  var reciprocalPriceSum = 0;
  for (var i = 0; i < itemObjects.length; i++) {
    reciprocalPrice[i] = average/Math.pow(itemObjects[i].price, config.gamblingExponent);
    reciprocalPriceSum += reciprocalPrice[i];
  }
  for (var i = 0; i < itemObjects.length; i++) {
    itemObjects[i].probability = reciprocalPrice[i]/reciprocalPriceSum;
  }

  db.pool.query("INSERT INTO crates (crateName, price, numItems) values (?, ?, ?)", [crate.crateName, crate.price, itemObjects.length], function(err, rows, fields){
    if (err) {
      callback(err);
      return;
    }

    var query = "";
    var params = [];
    var crateid = rows.insertId;
    for (var i = 0; i < itemObjects.length; i++) {
      query += "INSERT INTO crateitems (crateid, itemid, probability) VALUES (?, ?, ?);";
      params.push(crateid, itemObjects[i].itemid, itemObjects[i].probability);
    }
    db.pool.query(query, params, function (err, rows, fields) {
      if (err) {
        callback(err);
        return;
      }
      callback(null)
    });

  });
});
}

crate.retire = function(crateid, callback) {
  db.pool.query("UPDATE crates SET active = 0 WHERE crateid = ?", [crateid], function(err, rows, fields) {
    if (err) {
      callback(err);
      return;
    }
    if (rows.affectedRows == 0) {
      callback(new Error("Crate id "+crateid+" doesn't exist."));
      return;
    }
    callback(null);
  })
}

crate.open = function(crateid, callback) {
  db.pool.query("SELECT price, itemName, wear, rarity, numInStock, probability FROM crateitems JOIN items ON items.itemid = crateitems.itemid WHERE crateid = ?", [crateid], function(err, rows, fields) {
    if (err) {
      callback(err);
      return;
    }
    var items = [];
    for (var i = 0; i < rows.length; i++) {
      items.push({
        price: rows[i].price,
        itemName: rows[i].itemName,
        wear: rows[i].wear,
        rarity: rows[i].rarity,
        numInStock: rows[i].numInStock,
        probability: rows[i].probability
      });
    }
    var numbers = [];
    for (var i = 0; i < 10; i++) {
      numbers[i] = Math.random() * 10;
    }
    var chosenNumber = parseInt(""+numbers[0]+numbers[1]+numbers[2]+numbers[3]+numbers[4]+numbers[5]+numbers[6]+numbers[7]+numbers[8]+numbers[9]);
  });
}



module.exports = crate;
