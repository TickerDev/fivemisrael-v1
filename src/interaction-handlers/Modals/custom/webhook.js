const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ table: 'webhooks' });
const client = require('../../../index');
const humanizeDuration = require('humanize-duration');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Discord = require("discord.js")

class ModalHandler extends InteractionHandler {
    /**
     * @param {InteractionHandler.LoaderContext} context
     * @param {InteractionHandler.Options} options
     */
    constructor(context, options) {
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit
        });
    }


    /**
     * @param {import('discord.js').ModalSubmitInteraction} interaction
     */
    async run(interaction) {
        const webhook = interaction.fields.getTextInputValue('weblink');
        await db.set(interaction.channelId, webhook);
        interaction.reply({
            ephemeral: true, embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.embed_color)
                    .setThumbnail(interaction.guild.members.me.displayAvatarURL())
                    .setDescription("נשמר בהצלחה! בהצבעה הבאה זה יתריע בחדר ששמת.")
            ]
        })
    }

    /**
     * @param {import('discord.js').ModalSubmitInteraction} interaction
     */
    parse(interaction) {
        if (interaction.customId !== 'webhook') return this.none();
        return this.some();
    }
}

module.exports = {
    ModalHandler
};
