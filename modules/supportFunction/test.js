const Discord = require("discord.js");
const db = require("quick.db");
const Support = require("../../schemas/Database/support.js");

exports.run = async (bot, message, args, channel) => {
  function fetchTime(ms) {
    let y, d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    h = Math.floor(m / 60);
    d = Math.floor(h / 24);
    y = Math.floor(d / 365);

    if(y) return `${y}y, ${d - Math.floor(y * 365.25)}d`;
    if(d) return `${d}d, ${h - d * 24}h`;
    if(h) return `${h}h, ${m - h * 60}m`;
    if(m) return `${m}m, ${s - m * 60}s`;
    if(s) return `${s}s`;
  }

  const embed = new Discord.MessageEmbed()
    .setAuthor(`${message.author.tag} has created a new ticket!`, message.author.displayAvatarURL())
    .setDescription(`**__User Information:__**\n- User ID: ${message.author.id}\n- Account Created: ${fetchTime(Date.now() - message.author.createdTimestamp)} ago`)
    .setColor("#7289da")
    .setFooter("Created the ticket")
    .setTimestamp()

  await channel.send(embed);
  

  await Support.findOne({
    userID: message.author.id
  }, async (err, support) => {
    if(err) console.log(err);

    if(!support) {
      const newSupport = new Support({
        userID: message.author.id,
        open: "true",
        channelID: channel.id,
        created: Date.now(),
        userTag: message.author.tag
      });

      newSupport.save().catch(err => console.log(err));
    } else {
      support.open = "true";
      support.channelID = channel.id
      support.created = Date.now()

      support.save().catch(err => console.log(err));
    }
  });

  const embed_ = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setDescription("Successfully created a new ticket! Please state how we can help you.")
    .setTimestamp()

  return message.channel.send(embed_);
};