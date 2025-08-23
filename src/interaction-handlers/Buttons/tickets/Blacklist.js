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
class TicketAddButtonHandler extends InteractionHandler {
	constructor(ctx, options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	parse(interaction) {
		if (interaction.customId !== 'suggestblacklistbutton') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		const Modal = new Discord.ModalBuilder().setCustomId('suggestblacklistModal').setTitle('Blacklist');
		const serverName = new Discord.TextInputBuilder()
			.setPlaceholder(':לדוגמה Ticker#5975')
			.setLabel('שם בדיסקורד (כולל #) של האדם עליו אתה מגיש:')
			.setCustomId('namequestion')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);
		const serverDescription = new Discord.TextInputBuilder()
			.setPlaceholder('לדוגמה: 756424816516530247')
			.setLabel('איידי של מקבל הבלאקליסט:')
			.setCustomId('idquestion')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);
		const reason = new Discord.TextInputBuilder()
			.setPlaceholder("לדוגמה: עשה צ'יטים")
			.setLabel('סיבה לקבלת הבלאקליסט:')
			.setCustomId('reasonquestion')
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);
		const evidence = new Discord.TextInputBuilder()
			.setPlaceholder('לדוגמה: https://cdn.discordapp.com/attachments/1064236969795793017/1065030032315133962/2Q.png')
			.setLabel('הוכחה (חובה!):')
			.setCustomId('evidence')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);
		const evidence2 = new Discord.TextInputBuilder()
			.setPlaceholder('לדוגמה: https://cdn.discordapp.com/attachments/1064236969795793017/1065030032315133962/2Q.png')
			.setLabel('הוכחה (אינו חובה):')
			.setCustomId('evidence2')
			.setStyle(TextInputStyle.Short)
			.setRequired(false);
		const serverNameRow = new Discord.ActionRowBuilder().addComponents(serverName);
		const serverDescriptionRow = new Discord.ActionRowBuilder().addComponents(serverDescription);
		const reasonRow = new Discord.ActionRowBuilder().addComponents(reason);
		const evidenceRow = new Discord.ActionRowBuilder().addComponents(evidence);
		const evidenceRow2 = new Discord.ActionRowBuilder().addComponents(evidence2);

		Modal.addComponents([serverNameRow, serverDescriptionRow, reasonRow, evidenceRow, evidenceRow2]);
		await interaction.showModal(Modal);
	}
}
module.exports = {
	TicketAddButtonHandler
};
