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
		if (interaction.customId !== 'editform') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		if (interaction.channel.parentId == config.tickets.blacklist) {
			const Modal = new Discord.ModalBuilder().setCustomId('blacklistedit').setTitle('Edit Form (לשנות רק מה שצריך!)');
			const serverName = new Discord.TextInputBuilder()
				.setPlaceholder(':לדוגמה tickerboi')
				.setLabel('שם בדיסקורד (כולל #) של האדם עליו אתה מגיש:')
				.setCustomId('namequestion')
				.setStyle(TextInputStyle.Short)
				.setRequired(false);
			const serverDescription = new Discord.TextInputBuilder()
				.setPlaceholder('לדוגמה: 756424816516530247')
				.setLabel('איידי של מקבל הבלאקליסט:')
				.setCustomId('idquestion')
				.setStyle(TextInputStyle.Short)
				.setRequired(false);
			const reason = new Discord.TextInputBuilder()
				.setPlaceholder("לדוגמה: עשה צ'יטים")
				.setLabel('סיבה לקבלת הבלאקליסט:')
				.setCustomId('reasonquestion')
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(false);
			const evidence = new Discord.TextInputBuilder()
				.setPlaceholder('לדוגמה: https://cdn.discordapp.com/attachments/1064236969795793017/1065030032315133962/2Q.png')
				.setLabel('הוכחה (חובה!):')
				.setCustomId('evidence')
				.setStyle(TextInputStyle.Short)
				.setRequired(false);
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
		if (interaction.channel.parentId == config.tickets.addServers) {
			const Modal = new Discord.ModalBuilder().setCustomId('addserveredit').setTitle('Edit Form (לשנות רק מה שצריך!)');
			const serverName = new Discord.TextInputBuilder()
				.setPlaceholder('לדוגמה: Donuts-IL')
				.setLabel('שם השרת:')
				.setCustomId('namequestion')
				.setStyle(TextInputStyle.Short)
				.setRequired(false);
			const serverDescription = new Discord.TextInputBuilder()
				.setPlaceholder('רשמו פה')
				.setLabel('תיאור השרת:')
				.setCustomId('serverdescriptionquestion')
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(false);
			const serverImg = new Discord.TextInputBuilder()
				.setPlaceholder('לדוגמה: https://cdn.discordapp.com/attachments/1064236969795793017/1065030032315133962/2Q.png')
				.setCustomId('serverimg')
				.setLabel('תמונת השרת:')
				.setRequired(false)
				.setStyle(TextInputStyle.Short);
			const serverInvite = new Discord.TextInputBuilder()
				.setPlaceholder('לדוגמה: https://discord.gg/fivem-israel-875892539062910977')
				.setCustomId('serverinvite')
				.setLabel('קישור לשרת:')
				.setRequired(false)
				.setStyle(TextInputStyle.Short);
			const WhatType = new Discord.TextInputBuilder()
				.setPlaceholder('לדוגמה: Hosting')
				.setCustomId('whattype')
				.setLabel('Public/Allowlist/Whitelist/Fun/Hosting/Shop:')
				.setRequired(false)
				.setStyle(TextInputStyle.Short);

			const serverNameRow = new Discord.ActionRowBuilder().addComponents(serverName);
			const serverDescriptionRow = new Discord.ActionRowBuilder().addComponents(serverDescription);
			const serverImgRow = new Discord.ActionRowBuilder().addComponents(serverImg);
			const serverInviteRow = new Discord.ActionRowBuilder().addComponents(serverInvite);
			const whatTypeRow = new Discord.ActionRowBuilder().addComponents(WhatType);

			Modal.addComponents([serverNameRow, serverDescriptionRow, serverImgRow, serverInviteRow, whatTypeRow]);
			await interaction.showModal(Modal);
		}
	}
}
module.exports = {
	TicketAddButtonHandler
};
