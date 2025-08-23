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
const config = require("../../../../config")
const quick = require("quick.db")
const db = new quick.QuickDB({ table: "beta" })
class TicketAddButtonHandler extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    parse(interaction) {
        if (interaction.customId !== 'givebeta') return this.none();

        return this.some();
    }
    /**
     *
     * @param {CommandInteraction} interaction
     * @returns
     */
    async run(interaction) {
        const server = await this.container.client.db.getServer(interaction.channelId);
        if (!server) return interaction.reply({ ephemeral: true, content: "No server was found" })
        else {
            await db.set(interaction.channel.id, "beta")
            interaction.reply({
                content: "Gave Beta!",
                ephemeral: true
            })
            try {
                const owner = interaction.guild.members.cache.get(String(server.owner_id))
                if (!owner) return;
                owner.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setAuthor(
                                {
                                    name: "הבוט של פייבאם ישראל",
                                    iconURL: interaction.guild.iconURL()
                                }
                            )
                            .setTitle(`הודעה חשובה על השרת שלך`)
                            .setDescription(`שלום רב ${owner.user.displayName}, כאן הבוט של פייבאם ישראל, הרשימה מספר אחת בארץ
                            **אנחנו שמחים להודיע לך שהשרת שלך קיבל גישה לבטא הסגורה!**`)
                            .addFields([
                                {
                                    name: "?מה זה נותן",
                                    value: `גישה מוקדמת לבטא`,
                                    inline: true
                                },
                            ])
                            .setFooter({
                                text: "תמיד בשבילך - פייבאם ישראל",
                                iconURL: interaction.guild.iconURL()
                            })
                            .setColor(config.embed_color)
                    ],
                    components: [
                        new Discord.ActionRowBuilder()
                            .setComponents([
                                new ButtonBuilder()
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setLabel("לשרת שלך")
                                    .setURL(`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}`)
                                , new ButtonBuilder()
                                    .setStyle(Discord.ButtonStyle.Secondary)
                                    .setLabel("🚀 נשלח מפייבאם ישראל")
                                    .setDisabled(true)
                                    .setCustomId("sentfromfivemisraelyesyes")
                            ])

                    ]
                }).catch(err => [])
            } catch (error) {
                return;
            }

        }
    }
}
module.exports = {
    TicketAddButtonHandler
};
