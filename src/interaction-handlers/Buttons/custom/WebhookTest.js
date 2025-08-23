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
        if (interaction.customId !== 'webtest') return this.none();

        return this.some();
    }
    /**
     *
     * @param {CommandInteraction} interaction
     * @returns
     */
    async run(interaction) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embed_color)
                    .setDescription(`אווו נראה שאתה מעוניין בפיצ'ר החדש שלנו, לוגים להצבעות! <a:blobfast:1151693853699604540> 
מדובר בפיצ'ר מאוד פשוט, הנה הסבר לאיך להשתמש בו:
1. לך לחדר בשרת שאתה רוצה שזה יתריע על הצבעות וצור Webhook (לסרטון הסבר, [לחץ פה!](<https://www.youtube.com/watch?v=wzdZLWonn0Y>))
2. תעתיק את הקישור ל Webhook על ידי לחיצה על "Copy Webhook URL"
3. חזור לפה ולחץ על הכפתור למטה, שים את הלינק בקופסת כתיבה, שלח וזהו!
פשוט לא? גם אנחנו חושבים! עשה זאת עוד היום!`)
            ],
            components: [
                new Discord.ActionRowBuilder()
                    .addComponents([
                        new Discord.ButtonBuilder()
                            .setCustomId("changewebhook")
                            .setLabel("!התחל פה")
                            .setStyle(Discord.ButtonStyle.Primary)
                    ])
            ],
            ephemeral: true
        })
    }
}
module.exports = {
    TicketAddButtonHandler
};
