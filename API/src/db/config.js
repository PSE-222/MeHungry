const { MongoClient } = require("mongodb");
const db_config = require("../config/db")
const client = new MongoClient(db_config.ATLAS_URI);

let connect_db;

module.exports = {
  getDb: function () {
    connect_db = client.db("MeHungryDB");
    if (!connect_db) {
      console.log("Cannot connect to database.");
      return;
    }
    return connect_db;
  },
};