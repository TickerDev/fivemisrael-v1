const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const {
    Client,
    GatewayIntentBits,
    UserSelectMenuBuilder,
    Collection,
    ApplicationCommandOptionType,
    ActivityType,
    EmbedBuilder,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    CommandInteraction
} = require('discord.js');
const Discord = require('discord.js');
class TicketAddButtonHandler extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    parse(interaction) {
        if (interaction.customId !== 'updatemessage') return this.none();

        return this.some();
    }
    /**
     *
     * @param {CommandInteraction} interaction
     * @returns
     */
    async run(interaction) {
        console.log("I WAS CALLED GOD DAMN IT")
        const server = await this.container.client.db.getServer(interaction.channelId);
        console.log(server)
        if (!server) return interaction.reply({ ephemeral: true, content: "No server was found" })
        else {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${server.name}`)
                .setDescription(`${server.description}`)
                .addFields([
                    {
                        name: `<:people:1221112270768312320> Server Owner`,
                        value: `<@${server.owner_id}>`,
                        inline: true,
                    },
                    {
                        name: `<:checkmark:1221112246353006612> Votes`,
                        value: `${server.votes}`,
                        inline: true,
                    },
                ])
                .setThumbnail(`${server.image}`)
                .setTimestamp()
                .setFooter({
                    text: 'Fivem Israel ©️ 2021-2024',
                    iconURL: interaction.guild.members.me.displayAvatarURL()
                })
                .setColor("#1034A6");
            const row = new Discord.ActionRowBuilder().addComponents([
                new Discord.ButtonBuilder().setLabel('Join Here').setStyle(Discord.ButtonStyle.Link).setURL(`${server.invite}`),
                new Discord.ButtonBuilder().setLabel('Vote Server').setEmoji("<:checkmark:1221112246353006612>").setCustomId('voteforserver').setStyle(Discord.ButtonStyle.Primary),
                new Discord.ButtonBuilder().setLabel('Owner Options').setEmoji("<:blurple_crown:1221114322051141713>").setCustomId('owneroptions').setStyle(Discord.ButtonStyle.Primary)
            ]);
            const msg = await interaction.channel.messages.fetch(`${server.messageId}`)
            await msg.edit({
                embeds: [embed],
                components: [row]
            })

        }
    }
}
module.exports = {
    TicketAddButtonHandler
};
