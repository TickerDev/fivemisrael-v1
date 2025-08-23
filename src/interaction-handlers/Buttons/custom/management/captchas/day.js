const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config.js');
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
        if (interaction.customId !== 'captchaoneday') return this.none();

        return this.some();
    }
    /**
     *
     * @param {CommandInteraction} interaction
     * @returns
     */
    async run(interaction) {

    }
}
module.exports = {
    TicketAddButtonHandler
};
