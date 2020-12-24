const Discord = require("discord.js");
const hastebin = require("hastebin-gen");
const Blacklist = require("../schemas/Database/block.js");
const Support = require("../schemas/Database/support.js");

module.exports = async (bot, message) => {
  if(message.author.bot) return;
  const prefixMention = new RegExp(`^<@!?${bot.user.id}>( |)$`);

  const level = bot.permlevel(message);
  const permissionLevel = bot.permLevels[level];
  const args = message.content.slice(bot.config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  let command;

  if(bot.commands.has(cmd)) command = bot.commands.get(cmd);
  else if(bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd));

  if(message.channel.type === "dm") {
  if(!message.content.toLowerCase().startsWith(bot.config.prefix) && !command) {
    await Support.findOne({
      userID: message.author.id
    }, async (err, support) => {
      if(err) console.log(err);

      if(!support) {
      } else {
        if(support.open === "false") {
        } else {
          const channel = bot.channels.cache.get(support.channelID);

          const contentEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(message.content)
            .setColor("GREEN")
            .setFooter("Received from user")
            .setTimestamp()

          let images = [];
          let Attachment = (message.attachments).array();

          Attachment.forEach(attachment => {
            images.push(attachment.url)
          });

          if(message.attachments.size < 1) channel.send(contentEmbed);

          message.attachments.forEach(attachment => {
            const embed = new Discord.MessageEmbed()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setColor("GREEN")
              .setImage(message.attachments.first().url)
              .setFooter("Received from user")
              .setTimestamp()
            if(message.content) embed.setDescription(message.content)
            
            channel.send(embed);
          });

          message.react("✅");
        }
      }
    });
    }
  } else if(message.channel.type !== "dm") {
    if(!message.content.toLowerCase().startsWith(bot.config.prefix) && !command && !message.content.startsWith(".")) {
      await Support.findOne({
        channelID: message.channel.id
      }, async (err, support) => {
        if(err) console.log(err);

        if(!support) {
        } else {
          if(support.open === "false") {

          } else {
            const channel = bot.channels.cache.get(support.channelID);
            const user = bot.users.cache.get(support.userID);
            if(!user) return message.channel.send(`:x: \`${support.userTag}\` has left the server, ${message.author}! Please close this ticket.`);

            const contentEmbed = new Discord.MessageEmbed()
              .setAuthor(`${message.author.tag} (${permissionLevel})`, message.author.displayAvatarURL())
              .setColor("#7289da")
              .setDescription(message.content)
              .setFooter("Received from staff")
              .setTimestamp()

            const contentEmbed2 = new Discord.MessageEmbed()
              .setAuthor(`${message.author.tag} (${permissionLevel})`, message.author.displayAvatarURL())
              .setColor("7289da")
              .setDescription(message.content)
              .setFooter("Sent to user")
              .setTimestamp()

            let images = [];
            let Attachment = (message.attachments).array();

            Attachment.forEach(attachment => {
              images.push(attachment.url)
            });
    
            if(message.attachments.size < 1) user.send(contentEmbed);
            if(message.attachments.size < 1) channel.send(contentEmbed2);

            message.attachments.forEach(attachment => {
              const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag} (${permissionLevel})`, message.author.displayAvatarURL())
                .setColor("#7289da")
                .setImage(message.attachments.first().url)
                .setFooter("Received from staff")
                .setTimestamp()
              if(message.content) embed.setDescription(message.content)
              
              user.send(embed);
            });

            message.attachments.forEach(attachment => {
              const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag} (${permissionLevel})`, message.author.displayAvatarURL())
                .setColor("#7289da")
                .setImage(message.attachments.first().url)
                .setFooter("Sent to user")
                .setTimestamp()
              if(message.content) embed.setDescription(message.content)
              
              channel.send(embed);
            });

            if(message.attachments.size < 1) message.delete();
            if(!message.attachments.size < 1) message.delete({ timeout: 4000 });
          }
        }
      });
    }
  }

  await Blacklist.findOne({
    userID: message.author.id,
    blacklisted: "true"
  }, async (err, blacklist) => {
    if(err) console.log(err);

    let level = bot.permlevel(message);
    if(level == undefined) level = 0;

    if(!message.content.toLowerCase().startsWith(bot.config.prefix)) return;
    if(!command) return;

    if(!blacklist) {
      if(bot.talkedRecently.has(message.author.id)) {
        return message.channel.send(`:x: You are on cooldown, ${message.author}! Please run this command again in 1 second.`);
      } else {
        if(command.help.guildOnly == true && message.channel.type === "dm") return message.channel.send(`:x: This command is only executable in a server, ${message.author}!`);
        if(command.help.dmsOnly == true && message.channel.type !== "dm") return message.channel.send(`:x: This command is only executable in my DMs, ${message.author}!`);
        if(level < command.help.level) return message.channel.send(`:x: You don't have permission to run this command, ${message.author}!\n\n>>> - Your Level: ${level}\n- Required Level: ${command.help.level}`);
        if(level >= command.help.level && command) command.run(bot, message, args);
          
        bot.talkedRecently.add(message.author.id);

        setTimeout(() => {
          bot.talkedRecently.delete(message.author.id);
        }, 1000);
      }
    } else {
      if(blacklist.blacklisted == "true") {
        return message.channel.send(`:x: You are blocked from using my support system, ${message.author}! Reason: \`${blacklist.reason}\``);
      } else {
        if(bot.talkedRecently.has(message.author.id)) {
          return message.channel.send(`:x: You are on cooldown, ${message.author}! Please run this command again in 1 second.`);
        } else {
          if(command.help.guildOnly == true && message.channel.type === "dm") return message.channel.send(`:x: This command is only executable in a server, ${message.author}!`);
        if(command.help.dmsOnly == true && message.channel.type !== "dm") return message.channel.send(`:x: This command is only executable in my DMs, ${message.author}!`);
          if(level < command.help.level) return message.channel.send(`:x: You don't have permission to run this command, ${message.author}!\n\n>>> - Your Level: ${level}\n- Required Level: ${command.help.level}`);
          if(level >= command.help.level && command) command.run(bot, message, args);
            
          bot.talkedRecently.add(message.author.id);

          setTimeout(() => {
            bot.talkedRecently.delete(message.author.id);
          }, 1000);
        }
      }
    }
  });
};