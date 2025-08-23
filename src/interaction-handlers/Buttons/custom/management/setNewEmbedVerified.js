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
const db = new quick.QuickDB({ table: "verified" })
class TicketAddButtonHandler extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    parse(interaction) {
        if (interaction.customId !== 'setverified') return this.none();

        return this.some();
    }
    /**
     *
     * @param {CommandInteraction} interaction
     * @returns
     */
    async run(interaction) {
        const server = await this.container.client.db.getServer(interaction.channelId);
        console.log(server)
        if (!server) return interaction.reply({ ephemeral: true, content: "No server was found" })
        else {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`<:verified:1221112293971067003> ${server.name}`)
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
            await db.set(interaction.channel.id, "verified")
            interaction.reply({
                content: "Verified!",
                ephemeral: true
            })
            try {
                const owner = interaction.guild.members.cache.get(String(server.owner_id))
                if (!owner) return;
                owner.roles.add("1303516142639386666")
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
                            **אנחנו שמחים להודיע לך שהשרת שלך אומת על ידי פייבאם ישראל!**`)
                            .addFields([
                                {
                                    name: "?מה זה אומר",
                                    value: `אימות הינו דבר ששרתים גדולים מקבלים על מנת לאמת את עצמם. מתנה קטנה מאיתנו שהשרתים הגדולים ביותר מקבלים - ואתה אחד מהם!`,
                                    inline: true
                                },
                                {
                                    name: "?מה זה נותן",
                                    value: `מעבר לייצוגיות, מנהלי שרתים מאומתים מקבלים גישה לפיצ'רים בבטא מוקדמת!`,
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
