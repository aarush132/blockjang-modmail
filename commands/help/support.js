const Discord = require("discord.js");
const db = require("quick.db");
const Support = require("../../schemas/Database/support.js");
const exploiterFunction = require("../../modules/supportFunction/test.js");

exports.run = async (bot, message, args) => {
  async function collector(question, limit = 3600000) {
    const filter = m => m.author.id = message.author.id;
      await message.channel.send(question);
      try {
        const Acollected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
        return Acollected.first().content;
        } catch (e) {
        return false;
      }
    };
  await Support.findOne({
    userID: message.author.id
  }, async (err, support) => {
    if(err) console.log(err);

    if(!support) {

    } else {
      if(support.open === "true") {
        message.channel.send(`:x: You already have a ticket open, ${message.author}!`);
        await db.set(`stop`, true);
      }
    }
  });

  if(await db.fetch(`stop`) == true) {
    await db.delete(`stop`);
    return;
  }

  const embed = new Discord.MessageEmbed()
    .setAuthor(`Hello, ${message.author.username}!`, message.author.displayAvatarURL)
    .setColor("#18ff00")
    .setDescription("Please say:\n\n``bug report`` if it is a bug report\n\n``exploiter report`` if it is a exploiter report\n\n``abuser report`` if it is an admin abuser report\n\n``general support`` if it is general/other support")
    .setFooter("Say cancel to cancel.")
  
  let collected = await collector(embed);


//---------------------------------------------------\\

  const channel = await bot.guilds.cache.get(bot.config.mailGuild).channels.create(`${message.author.username}-${message.author.discriminator}`);
  await channel.setParent("791380123885633566");
  await channel.setTopic(`Support for ${message.author.tag} | User ID: ${message.author.id}`);

  if(collected.toLowerCase() === "cancel" || collected.toLowerCase() === "cancel." || collected.toLowerCase() === "cancel!") {
    return message.channel.send("✅ Successfully cancelled!");
  } else if(collected.toLowerCase() === "exploiter report" || collected.toLowerCase() === "Exploiter report." || collected.toLowerCase() === "exploiter") {
    await channel.setParent("791379007623004200")
    exploiterFunction.run(bot, message, args, channel)   
  } else if(collected.toLowerCase() === "abuser report" || collected.toLowerCase() === "Abuser report." || collected.toLowerCase() === "abuser") {
    await channel.setParent("791379204674945054")
    exploiterFunction.run(bot, message, args, channel)
  } else if(collected.toLowerCase() === "bug report" || collected.toLowerCase() === "Bug report." || collected.toLowerCase() === "bug") {
    await channel.setParent("791377487975546900")
    exploiterFunction.run(bot, message, args, channel)
  } else if(collected.toLowerCase() === "general support" || collected.toLowerCase() === "General support." || collected.toLowerCase() === "support") {
    await channel.setParent("791380058529988690")
    exploiterFunction.run(bot, message, args, channel)
  } else {
    message.channel.send("Error 409, message is not any of the above options.")
    await channel.delete()
  }

//---------------------------------------------------\\
};

module.exports.help = {
	name: "support",
	aliases: [],
	description: "",
	usage: "",
	category: "help",
  level: 0,
  dmsOnly: true,
  guildOnly: false
};