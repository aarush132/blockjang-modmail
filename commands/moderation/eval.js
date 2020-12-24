const Discord = require("discord.js");

module.exports.run = (bot, message, args) => {
  try {
    if(!args.join(" ")) return message.channel.send(":x: You didn't input anything for me to evaluate!")
    let code = eval(args.join(" "));

    if (typeof code !== "string") code = require("util").inspect(code, { depth: 0 });
    let embed = new Discord.MessageEmbed()
      .setColor("#7289DA")
      .addField("Input", `\`\`\`js\n${args.join(" ")}\`\`\``)
      .addField("Output", `\`\`\`js\n${code}\n\`\`\``)
    
    message.channel.send(embed);
  } catch(e) {
    message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
  }
};

module.exports.help = {
	name: "meval",
	aliases: [],
	description: "Runs JavaScript code!",
	usage: "<code>",
	category: "admin",
  level: 6,
  dmsOnly: false,
  guildOnly: true
};