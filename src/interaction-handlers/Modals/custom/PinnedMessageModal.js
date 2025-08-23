const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ table: 'tickets' });
const client = require("../../../index")
const { EmbedBuilder, Embed } = require("discord.js")
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
        console.log("test")
        const message = interaction.fields.getTextInputValue("message");
        const server = await this.container.client.db.getServer(interaction.channelId);
        if (!server) return interaction.reply({ ephemeral: true, content: "No server was found" })
        const msg = await interaction.channel.messages.fetch(`${server.messageId}`)
        if (!msg) return interaction.reply({ ephemeral: true, content: "No server was found" })
        const embed = new EmbedBuilder(msg.embeds[0])
        const field = embed.data.fields.find((field) => field.name?.toLowerCase().includes('pinned message'));
        if (field) {
            embed.data.fields = embed.data.fields.filter((field) => !field.name?.toLowerCase().includes('pinned message'));

            embed.addFields({
                name: "<:blurple_pin:1221114050004652153> Pinned Message",
                value: `"**${message}**"`
            });
        } else embed.addFields({
            name: '<:blurple_pin:1221114050004652153> Pinned Message',
            value: `"**${message}**"`
        });


        msg.edit({ embeds: [embed] })
        interaction.reply({ content: "הודעה הוצמדה בהצלחה!", ephemeral: true })
    }

    /**
     * @param {import('discord.js').ModalSubmitInteraction} interaction
     */
    parse(interaction) {
        if (interaction.customId !== 'pinnedmessagemodal') return this.none();

        return this.some();
    }
}

module.exports = {
    ModalHandler
};
