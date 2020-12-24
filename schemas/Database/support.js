const mongoose = require("mongoose");

const supportSchema = mongoose.Schema({
  userID: String,
  open: String,
  channelID: String,
  created: String,
  userTag: String
});

module.exports = mongoose.model("Support", supportSchema);