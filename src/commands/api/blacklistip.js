const { Command } = require('@sapphire/framework')
const Discord = require("discord.js")
const API_URL = 'http://localhost:3000/api/admin/generate-key';
const password = 'jRcmsBvEcGTAlwROesDAINxNEIs';
const axios = require("axios")
class UserCommand extends Command {
    /**
     * @param {Command.LoaderContext} context
     */
    constructor(context) {
        super(context, {
            name: 'blacklistip',
            description: 'Blacklist an IP from our API'
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
                    .addStringOption(o => o.setName("ip").setDescription("IP to blacklist").setRequired(true))
        );
    }

    /**
     * @param {Command.ChatInputCommandInteraction} interaction
     */
    async chatInputRun(interaction) {
        if (interaction.user.id !== "470957190069616647") return interaction.reply({ content: "You do not have access to this feature", ephemeral: true });
        const result = await this.api(interaction.options.getString("ip"));
        if (result == 200) {
            return interaction.reply({ ephemeral: true, content: `✅ **Blacklisted ${interaction.options.getString("ip")}**` })
        }
        console.log(JSON.stringify(result.response))
        if (result.response.data.message == "IP address is already blacklisted") return interaction.reply({ ephemeral: true, content: `❎ **${interaction.options.getString("ip")} is already blacklisted!**` })
        if (result.response.status == 400) return interaction.reply({ ephemeral: true, content: "Error!" })

    }
    async api(ip) {
        const password = 'jRcmsBvEcGTAlwROesDAINxNEIs'; // Your admin password
        const apiUrl = 'http://localhost:3000/api/admin/ban-ip'; // Your API URL

        try {
            const response = await axios.post(apiUrl, { ip, password });
            return response.status;
        } catch (error) {
            return error;
        }
    }

}

module.exports = {
    UserCommand
}


