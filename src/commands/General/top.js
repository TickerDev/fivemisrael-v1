const { Command } = require('@sapphire/framework')
const Discord = require("discord.js")
const config = require("../../config")
const client = require('../../index');

class UserCommand extends Command {
    /**
     * @param {Command.LoaderContext} context
     */
    constructor(context) {
        super(context, {
            // Any Command options you want here
            name: 'top',
            description: '[LIST-USERS] ראו את השרתים בטופ 🏆',
            cooldownDelay: 5 * 1000
        });
    }

    /**
     * @param {Command.Registry} registry
     */
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder //
                    .setName(this.name)
                    .setDescription(this.description)
        );
    }

    /**
     * @param {Command.ChatInputCommandInteraction} interaction
     */
    async chatInputRun(interaction) {
        const allServers = await client.db.getAllServers({
            sort: true
        })
//	console.log(allServers)
        let topServers = '';
        for (let i = 0; i < 5; i++) {
            if (i == 0) {
                topServers += "🥇 "
            }
            else if (i == 1) {
                topServers += "🥈 "

            }
            else if (i == 2) {
                topServers += "🥉 "

            }
            topServers += `\`${i + 1}.\` **[${allServers[i].name}](https://discord.com/channels/${interaction.guild.id}/${allServers[i].channelID}) - ${allServers[i].votes} הצבעות!**\n`
        }
//console.log(topServers)  
      if (topServers.length > 4096) {
            topServers = topServers.substring(0, 4093) + '...';
        }

        return interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle("🏆 שרתים בטופ הרשימה 🏆")
                    .setDescription(topServers + "\n ** בהצלחה לכולם!**")
                    .setColor(Discord.Colors.Blurple)
            ]
        })
    }
}

module.exports = {
    UserCommand
}
