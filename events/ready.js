const moment = require("moment");

module.exports = async (bot) => {
  console.log(`[${moment().format("DD-MM-YYYY HH:mm")}] This is ${bot.user.username}#${bot.user.discriminator} speaking! Online and awaiting orders!`);
  bot.user.setActivity("out for exploiters!", { type: "WATCHING" })
};