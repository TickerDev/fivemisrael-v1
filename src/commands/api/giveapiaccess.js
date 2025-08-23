const { Command } = require('@sapphire/framework')
const Discord = require("discord.js")
const API_URL = 'http://localhost:61050/api/admin/generate-key';
const password = 'jRcmsBvEcGTAlwROesDAINxNEIs';
const axios = require("axios")
class UserCommand extends Command {
    /**
     * @param {Command.LoaderContext} context
     */
    constructor(context) {
        super(context, {
            name: 'giveapiaccess',
            description: 'Give access to our API'
        });
    }

    /**
     * @param {Command.Registry} registry
     */
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addChannelOption(o => o.setName("channel").setDescription("Channel for the API").setRequired(true))
        );
    }

    /**
     * @param {Command.ChatInputCommandInteraction} interaction
     */
    async chatInputRun(interaction) {
        if (interaction.user.id !== "470957190069616647") return interaction.reply({ content: "You do not have access to this feature", ephemeral: true });
        const result = await this.api(interaction.options.getChannel("channel").id);
        if (result == null) return interaction.reply({ ephemeral: true, content: "Error!" })
        const apikey = result;
        const embed = new Discord.EmbedBuilder()
            .setTitle("New API Key")
            .setColor("#1034A6")
            .setFields([
                {
                    name: "API Key",
                    value: apikey,
                    inline: true
                },
                {
                    name: "Channel",
                    value: "<#" + interaction.options.getChannel("channel") + ">",
                    inline: true
                }
            ]);
        interaction.reply({ ephemeral: true, embeds: [embed] })
    }
    async api(channelid) {
        try {
            const response = await axios.post(API_URL, { channelid, password });
            return response.data.apiKey;
        } catch (error) {
            console.error(error.response.data.message);
            return null;
        }
    }

}

module.exports = {
    UserCommand
}


