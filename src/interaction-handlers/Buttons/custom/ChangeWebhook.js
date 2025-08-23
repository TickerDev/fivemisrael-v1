const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config');
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
const client = require('../../../index');

class TicketAddButtonHandler extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    parse(interaction) {
        if (interaction.customId !== 'changewebhook') return this.none();

        return this.some();
    }
    /**
     *
     * @param {CommandInteraction} interaction
     * @returns
     */
    async run(interaction) {
        const Modal = new Discord.ModalBuilder().setCustomId('webhook').setTitle('לוגים להצבעות');
        const serverName = new Discord.TextInputBuilder()
            .setLabel('קישור:')
            .setCustomId('weblink')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const serverNameRow = new Discord.ActionRowBuilder().addComponents(serverName);

        Modal.addComponents([serverNameRow]);
        await interaction.showModal(Modal);

    }
}
module.exports = {
    TicketAddButtonHandler
};
