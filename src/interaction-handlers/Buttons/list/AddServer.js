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
		if (interaction.customId !== 'addserverbutton') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		const Modal = new Discord.ModalBuilder().setCustomId('addserverModal').setTitle('Add Your Server');
		const serverName = new Discord.TextInputBuilder()
			.setPlaceholder('לדוגמה: Donuts-IL')
			.setLabel('שם השרת:')
			.setCustomId('namequestion')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);
		const serverDescription = new Discord.TextInputBuilder()
			.setPlaceholder('רשמו פה')
			.setLabel('תיאור השרת:')
			.setCustomId('serverdescriptionquestion')
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
			.setMinLength(1)
			.setMaxLength(1023);
		const serverImg = new Discord.TextInputBuilder()
			.setPlaceholder('לדוגמה: https://cdn.discordapp.com/attachments/1064236969795793017/1065030032315133962/2Q.png')
			.setCustomId('serverimg')
			.setLabel('תמונת השרת:')
			.setRequired(true)
			.setStyle(TextInputStyle.Short);
		const serverInvite = new Discord.TextInputBuilder()
			.setPlaceholder('לדוגמה: https://discord.gg/fivem-israel-875892539062910977')
			.setCustomId('serverinvite')
			.setLabel('קישור לשרת:')
			.setRequired(true)
			.setStyle(TextInputStyle.Short);
		const WhatType = new Discord.TextInputBuilder()
			.setPlaceholder('לדוגמה: Hosting')
			.setCustomId('whattype')
			.setLabel('Public/Allowlist/Whitelist/Fun/Hosting/Shop:')
			.setRequired(true)
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
module.exports = {
	TicketAddButtonHandler
};
