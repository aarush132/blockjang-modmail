const { Client, Collection } = require("discord.js");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const { readdirSync } = require("fs");
const { sep } = require("path");
const { success, error, warning } = require("log-symbols");
const config = require("./config");
const keepAlive = require("./server.js");

const bot = new Discord.Client();
require("./modules/functions.js")(bot);

["commands", "aliases"].forEach(x => bot[x] = new Discord.Collection());

bot.config = config;
bot.talkedRecently = new Set();

mongoose.connect(process.env.MONGODBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Mongoose connected successfully!")).catch(err => {
  console.log(`Mongoose Connection Error: ${err}`);
});

/*bot.on("debug", (debug) => {
  console.log(debug);
});*/

/*bot.on("rateLimit", info => {
  console.log(`Rate limit hit: ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: "Unknown timeout"}`)
});*/

fs.readdir("./events/", (err, files) => {
  if(err) return console.error(err);
  
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`${success} Loaded event '${eventName}'!`)
    bot.on(eventName, event.bind(null, bot));
    delete event;
  });
});

const load = (dir = "./commands/") => {
  bot.commandsNumber = 0;
  readdirSync(dir).forEach(dirs => {
    const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js"));

		for(const file of commands) {
			const pull = require(`${dir}/${dirs}/${file}`);
			if(pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
				if(bot.commands.get(pull.help.name)) return console.warn(`${warning} Two or more commands have the same name! (${pull.help.name})`);
				bot.commands.set(pull.help.name, pull);
        bot.commandsNumber++
				console.log(`${success} Loaded command '${pull.help.name}'!`);
			}
			else {
			  console.log(`${error} Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string, or you have a missing help.category or help.category is not a string!`);
				continue;
			}
			if(pull.help.aliases && typeof (pull.help.aliases) === "object") {
				pull.help.aliases.forEach(alias => {
					if(bot.aliases.get(alias)) return console.warn(`${warning} Two or more commands have the same aliases! (${alias})`);
					bot.aliases.set(alias, pull.help.name);
				});
			}
    }
	});
};

(async () => {
  load();
  keepAlive();
  await bot.login(process.env.TOKEN).catch(console.error());
})();   