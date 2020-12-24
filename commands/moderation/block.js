const Discord = require("discord.js");
const Blacklist = require("../../schemas/Database/block.js");

module.exports.run = async (bot, message, args) => {
  let user;
  let stop = "false";
  if(!args[0]) return message.channel.send(`:x: You didn't specify a user to block from creating tickets, ${message.author}!`);

  try {
    user = message.mentions.users.first() || await bot.users.fetch(args[0]);
  } catch(e) {
    return message.channel.send(`:x: \`${args[0]}\` is not a valid user, ${message.author}!`);
  } 
  
  let reason = args.slice(1).join(" ");
  if(!reason) reason = ":x: No reason specified";

  if(user) {

  } else {
    return message.channel.send(`:x: \`${args[0]}\` is not a valid user, ${message.author}!`);
  }

  const embed = new Discord.MessageEmbed()
    .setAuthor("Moderation Action", user.displayAvatarURL({ dynamic: true }))
    .setColor("#7289da")
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setDescription("A user has been blocked from creating tickets!")
    .addField("Reason:", reason)
    .addField("Offender:", `${user} - ${user.tag} (user ID: ${user.id})`)
    .addField("Responsible Staff Member:", `${message.author} - ${message.author.tag} (user ID: ${message.author.id})`)
    .setTimestamp()

  if(reason === ":x: No reason specified") {
    await Blacklist.findOne({
      userID: user.id
    }, async (err, blacklist) => {
      if(err) console.log(err);

      if(!blacklist) {
        const newBlacklist = new Blacklist({
          userID: user.id,
          blacklisted: "true",
          reason: "No reason specified"
        });

        newBlacklist.save().catch(err => console.log(err));
      } else {
        if(blacklist.blacklisted === "true") {
          message.channel.send(`:x: This user is already blocked from creating tickets, ${message.author}! Reason: \`${blacklist.reason}\``);
          
          stop = "true";
          return
        } else {
          blacklist.blacklisted = "true";
          blacklist.reason = "No reason specified";

          blacklist.save().catch(err => console.log(err));
        }
      }
    });
    
    if(stop === "true") return;

    if(stop !== "true") await bot.channels.cache.get(bot.config.blockLoggingChannel).send(embed);
    if(stop !== "true") return await message.channel.send(`:white_check_mark: Successfully blocked \`${user.tag}\` from creating tickets, ${message.author}!`);
  } else {
    await Blacklist.findOne({
      userID: user.id
    }, async (err, blacklist) => {
      if(err) console.log(err);

      if(!blacklist) {
        const newBlacklist = new Blacklist({
          userID: user.id,
          blacklisted: "true",
          reason: reason
        });

        newBlacklist.save().catch(err => console.log(err));
      } else {
        if(blacklist.blacklisted === "true") {
          return await message.channel.send(`:x: This user is already blocked from creating tickets, ${message.author}! Reason: \`${blacklist.reason}\``);

          stop = "true";
        } else {
          blacklist.blacklisted = "true";
          blacklist.reason = reason;

          blacklist.save().catch(err => console.log(err));
        }
      }
    });
    
    if(stop === "true") return;

    await bot.channels.cache.get(bot.config.blockLoggingChannel).send(embed);

    if(reason === ":x: No reason specified") {
      return await message.channel.send(`:white_check_mark: Successfully blocked \`${user.tag}\` from creating tickets with no reason specified, ${message.author}!`);
    } else {
      return await message.channel.send(`:white_check_mark: Successfully blocked \`${user.tag}\` from creating tickets with reason: \`${reason}\`, ${message.author}!`);
    }
  }
};

module.exports.help = {
	name: "block",
	aliases: [],
	description: "",
	usage: "<user id or user mention> <reason>",
	category: "admin",
  level: 1,
  dmsOnly: false,
  guildOnly: true
};