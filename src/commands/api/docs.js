const { Command } = require('@sapphire/framework')
const Discord = require("discord.js")
const config = require("../../config")
const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
class UserCommand extends Command {
    /**
     * @param {Command.LoaderContext} context
     */
    constructor(context) {
        super(context, {
            name: 'docs',
            description: 'Check our API docs'
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
        );
    }

    /**
     * @param {Command.ChatInputCommandInteraction} interaction
     */
    async chatInputRun(interaction) {
        const paginatedMessage = new PaginatedMessage({
            template: new Discord.EmbedBuilder()
                .setColor(config.embed_color)
                // Be sure to add a space so this is offset from the page numbers!
                .setFooter({ text: 'Page ' })
        });

        paginatedMessage
            .addPageEmbed((embed) =>
                embed //
                    .setTitle("/api/getServerVotes")
                    .addFields([
                        {
                            name: "Purpose",
                            value: "Get all votes for your server (since March 11th 2024)",
                            inline: true,
                        },
                        {
                            name: "Requirements",
                            value: "**API Key**, **ChannelID** (Tied to your API Key)",
                            inline: true,
                        },
                        {
                            name: "Usage Node.JS",
                            value: `\`\`\`js
axios.get(\`http://fivemisrael.com:3000/api/getServerVotes\`, {
    headers: {
        'Authorization': \`Bearer \${ API_KEY }\`
    },
    data: {
        channel_id: \${channelid},
    }
})
    .then(response => {
        return (response.data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });                 
                            \`\`\``,
                            inline: false,
                        },
                    ])
            )
            .addPageEmbed((embed) =>
                embed //
                    .setTitle("/api/getUserServerVotes")
                    .addFields([
                        {
                            name: "Purpose",
                            value: "Get all votes for your server (since March 11th 2024) from a specific user",
                            inline: true,
                        },
                        {
                            name: "Requirements",
                            value: "**API Key**, **ChannelID** (Tied to your API Key), **MemberID**",
                            inline: true,
                        },
                        {
                            name: "Usage Node.JS",
                            value: `\`\`\`js
axios.get(\`http://fivemisrael.com:3000/api/getUserServerVotes\`, {
    headers: {
        'Authorization': \`Bearer \${ API_KEY }\`
    },
    data: {
        channel_id: \${channelid},
        member_id: \${member_id}
    }
})
    .then(response => {
        return (response.data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });                 
                            \`\`\``,
                            inline: false,
                        },

                    ])
            )
        await paginatedMessage.run(interaction, interaction.user);

    }


}

module.exports = {
    UserCommand
}


