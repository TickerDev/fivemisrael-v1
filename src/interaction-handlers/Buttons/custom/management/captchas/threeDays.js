

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
const quick = require("quick.db");
const Captcha = new quick.QuickDB({ table: "captcha" });
class TicketAddButtonHandler extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    parse(interaction) {
        if (interaction.customId !== 'captchathreedays') return this.none();

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
