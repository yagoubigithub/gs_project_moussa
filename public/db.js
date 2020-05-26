const sqlite = require("sqlite3").verbose();
  db = new sqlite.Database("data.sqlite", error => {
    if (error) return console.log(error);
    console.log("Connnect to sqlite3");
  });

  db.serialize(function() {

  });
module.exports = db;