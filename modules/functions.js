const moment = require("moment");

module.exports = bot => {
  bot.permlevel = message => {
    let permlvl = 0;

    const member = bot.guilds.cache.get("791370150422642708").members.cache.get(message.author.id);

    if(!member) {

    } else {
      /*Owner*/ if(member.roles.cache.has("791371848562114600")) permlvl = 7;
      /*Manager*/ if(member.roles.cache.has("791370421643247666")) permlvl = 6;
      /*Staff Member*/ if(member.roles.cache.has("791370601423044608")) permlvl = 5;  
      return permlvl;
    }
  };

  bot.permLevels = {
    0: "User",
    1: "Member",
    5: "Staff Member",
    6: "Manager",
    7: "Owner",
  };

  global.wait = require('util').promisify(setTimeout);

  bot.log = (type, msg, title) => {
		var time = moment().format('D MMM YYYY HH:mm:ss ZZ');
		if (!title) title = 'Log';
		console.log(`${time}: [${type}] [${title}] ${msg}`);
  };
};