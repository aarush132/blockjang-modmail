const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
  userID: String,
  blacklisted: String,
  reason: String
});

module.exports = mongoose.model("Blacklist", blacklistSchema);