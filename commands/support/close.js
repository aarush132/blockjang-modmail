const Discord = require("discord.js");
const hastebin = require("hastebin-gen");
const fetch = require("node-fetch");
const db = require("quick.db");
const Support = require("../../schemas/Database/support.js");
const moment = require("moment");

exports.run = async (bot, message, args) => {
  var stop;

  await Support.findOne(
    {
      channelID: message.channel.id,
    },
    async (err, support) => {
      if (err) console.log(err);

      if (!support) {
        return message.channel.send(
          `:x: You are not in a ticket, ${message.author}!`
        );
      } else {
        const a = await message.channel.send(
          `:white_check_mark: Closing ticket in 5 seconds, ${message.author}!`
        );
        await wait(1000);
        await a.edit(
          `:white_check_mark: Closing ticket in 4 seconds, ${message.author}!`
        );
        await wait(1000);
        await a.edit(
          `:white_check_mark: Closing ticket in 3 seconds, ${message.author}!`
        );
        await wait(1000);
        await a.edit(
          `:white_check_mark: Closing ticket in 2 seconds, ${message.author}!`
        );
        await wait(1000);
        await a.edit(
          `:white_check_mark: Closing ticket in 1 second, ${message.author}!`
        );
        await wait(1000);

        await Support.findOne(
          {
            channelID: message.channel.id,
          },
          async (err, support) => {
            if (err) console.log(err);

            if (!support) {
              stop = true;

              return message.channel.send(
                `:x: You are not in a ticket, ${message.author}!`
              );
            } else {
              if(support.open === "false") {
                stop = true;

                return message.channel.send(
                  `:x: You are not in a ticket, ${message.author}!`
                );
              }

              if(stop) return;

              support.open = "false";

              support.save().catch((err) => console.log(err));
                  const user01 = bot.users.cache.get(support.userID)
                  if(!user01) {
                    const embed = new Discord.MessageEmbed()
                      .setAuthor("Ticket Closure")
                      .setColor("#7289da")
                      .setDescription("A user's ticket was closed but they left the server!")
                      .addField(
                        "Ticket Creator:",
                        `${support.userTag} (user ID: ${support.userID})`
                      )
                      .addField(
                        "Responsible Staff Member:",
                        `${message.author} - ${message.author.tag} (user ID: ${message.author.id})`
                      )
                      .setTimestamp();

                    bot.channels.cache
                      .get(bot.config.supportLoggingChannel)
                      .send(embed);
                  } else {
                    const embed = new Discord.MessageEmbed()
                      .setAuthor(
                        "Ticket Closure",
                        bot.users.cache
                          .get(support.userID)
                          .displayAvatarURL({ dynamic: true })
                      )
                      .setColor("#7289da")
                      .setThumbnail(
                        bot.users.cache
                          .get(support.userID)
                          .displayAvatarURL({ dynamic: true })
                      )
                      .setDescription("A user's ticket was closed!")
                      .addField(
                        "Ticket Creator:",
                        `${bot.users.cache.get(support.userID)} - ${
                          bot.users.cache.get(support.userID).tag
                        } (user ID: ${bot.users.cache.get(support.userID).id})`
                      )
                      .addField(
                        "Responsible Staff Member:",
                        `${message.author} - ${message.author.tag} (user ID: ${message.author.id})`
                      )
                    .setTimestamp();
                
                    message.channel.delete();
                    const embed2 = new Discord.MessageEmbed()
                      .setColor("RED")
                      .setDescription(`A staff member has closed your ticket!`)
                      .setTimestamp();


                    bot.users.cache.get(support.userID).send(embed2);

                    bot.channels.cache
                      .get(bot.config.supportLoggingChannel)
                      .send(embed);

                }
              }
            });
          }
        }
      );
}

module.exports.help = {
  name: "close",
  aliases: [],
  description: "",
  usage: "",
  category: "support",
  level: 1,
  dmsOnly: false,
  guildOnly: true,
};