var db = require("../db")
var config = require("../config")

var crate = function() {

}


crate.create = function(crate, items, callback){
  /*
  crate = {
  crateName:
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
      price: parseFloat(rows[i].price)
    });
  }
  var average = 0;
  for (var i = 0; i < itemObjects.length; i++) {
    average += itemObjects[i].price;
  }
  average /= itemObjects.length;
  var reciprocalPrice = []
  var reciprocalPriceFair = []
  var reciprocalPriceFairSum = 0;
  var reciprocalPriceSum = 0;
  for (var i = 0; i < itemObjects.length; i++) {
    reciprocalPrice[i] = average/Math.pow(itemObjects[i].price, config.gamblingExponent);
    reciprocalPriceSum += reciprocalPrice[i];
    reciprocalPriceFair[i] = average/Math.pow(itemObjects[i].price, 1);
    reciprocalPriceFairSum += reciprocalPriceFair[i];
  }
  for (var i = 0; i < itemObjects.length; i++) {
    itemObjects[i].probability = reciprocalPrice[i]/reciprocalPriceSum;
    itemObjects[i].probabilityFair = reciprocalPriceFair[i]/reciprocalPriceFairSum;
  }
  var expectedValue = 0;

  for (var i = 0; i < itemObjects.length; i++) {
    expectedValue += itemObjects[i].probabilityFair * itemObjects[i].price;
  }

  db.pool.query("INSERT INTO crates (crateName, price, numItems) values (?, ?, ?)", [crate.crateName, expectedValue, itemObjects.length], function(err, rows, fields){
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

crate.open = function(username, crateid, callback) {
  db.pool.query("SELECT price, itemName, wear, rarity, numInStock, probability FROM crateitems JOIN items ON items.itemid = crateitems.itemid WHERE crateid = ?", [crateid], function(err, rows, fields) {
    if (err) {
      callback(err);
      return;
    }
    var items = [];
    for (var i = 0; i < rows.length; i++) {
      items.push({
        price: parseFloat(rows[i].price),
        itemName: rows[i].itemName,
        wear: parseInt(rows[i].wear),
        rarity: parseInt(rows[i].rarity),
        numInStock: parseInt(rows[i].numInStock),
        probability: parseFloat(rows[i].probability)
      });
    }
    var number = Math.random();
    var ranges = [];
    for (var i = 0; i < items.length - 1; i++) {
      ranges[i] = 0;
      for (var j = 0; j <= i; j++) {
        ranges[i] += items[j].probability;
      }
    }
    ranges[items.length - 1] = 1;
    var chosenIndex;
    for (var i = 0; i < ranges.length; i++) {
      if (i == 0) {
        if (number > 0 && number <= ranges[i]) {
          chosenIndex = i;
          break;
        }
        else {
          continue;
        }
      }
      else {
        if (number > ranges[i - 1] && number <= ranges[i]) {
          chosenIndex = i;
          break;
        }
        else {
          continue;
        }
      }
    }
    callback(null, items[chosenIndex]);
  });
}

crate.list = function(callback) {
  db.pool.query("SELECT crateid, price, numItems, crateName, dateCreated FROM crates WHERE active = 1", function(err, rows, fields) {
    if (err) {
      callback(err);
      return;
    }
    var crates = [];
    for (var i = 0; i < rows.length; i++) {
      crates.push({
        crateid: rows[i].crateid,
        price: rows[i].price,
        numItems: rows[i].numItems,
        crateName: rows[i].crateName,
        dateCreated: rows[i].dateCreated
      });
    }
    callback(null, crates);
  });
}

crate.getItems = function(crateid, callback) {
  db.pool.query("SELECT crateItemid, crateItems.itemid, probability, price, itemName, skinName, wear, rarity FROM crateitems JOIN items ON items.itemid = crateitems.itemid WHERE crateid = ?", [crateid] , function(err, rows, fields) {
    if (err) {
      callback(err);
      return;
    }
    var items = [];
    for (var i = 0; i < rows.length; i++) {
      items.push({
        crateid: rows[i].crateItemid,
        itemid: rows[i].itemid,
        probability: rows[i].probability,
        probabilityPercent: parseFloat((rows[i].probability*100).toFixed(2)),
        price: rows[i].price,
        itemName: rows[i].itemName,
        skinName: rows[i].skinName,
        wear: rows[i].wear,
        wearName: numToWear(rows[i].wear),
        rarity: rows[i].rarity,
        rarityColor: numToRarity(rows[i].rarity)
      });
    }
    callback(null, items);
  })
}

crate.getName = function (crateid, callback) {
  db.pool.query('SELECT crateName FROM crates WHERE crateid = ?', [crateid], function(err, rows, fields) {
    if (err) {
      callback(err);
      return;
    }
    if (rows.length == 0) {
      callback(null, "N/A");
      return;
    }
    callback(null, rows[0].crateName);
    return;
  });
}

module.exports = crate;

function numToWear(num){
  switch (num) {
    case 1:
    return "Battle Scarred";
    break;
    case 2:
    return "Well Worn";
    break;
    case 3:
    return "Field Tested";
    break;
    case 4:
    return "Minimal Wear";
    break;
    case 5:
    return "Factory New";
    break;
    default:
    return "N/A";
  }
}

function numToRarity(num) {
  switch (num) {
    case 1:
    return "white";
    break;
    case 2:
    return "light-blue";
    break;
    case 3:
    return "dark-blue";
    break;
    case 4:
    return "purple";
    break;
    case 5:
    return "pink";
    break;
    case 6:
    return "red";
    break;
    case 7:
    return "gold";
    case 8:
    return "orange";
    break;
    default:
    return "N/A";
  }
}
