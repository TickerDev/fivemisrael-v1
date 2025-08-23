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
	CommandInteraction,
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
		if (interaction.customId !== 'setvotessecretmenu') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		const Modal = new Discord.ModalBuilder().setCustomId('votessecretmenu').setTitle('שינוי הצבעות (secret Menu)');
		const serverName = new Discord.TextInputBuilder()
			.setPlaceholder('מספר פה')
			.setLabel('כמה הצבעות?')
			.setCustomId('namequestion')
			.setStyle(TextInputStyle.Short)
			.setRequired(false);
		const WhatType = new Discord.TextInputBuilder()
			.setCustomId('confirmingsecret')
			.setLabel('To confirm, please reply with CoNFiRm')
			.setRequired(false)
			.setStyle(TextInputStyle.Short);

		const serverNameRow = new Discord.ActionRowBuilder().addComponents(serverName);

		const whatTypeRow = new Discord.ActionRowBuilder().addComponents(WhatType);
		Modal.addComponents([serverNameRow, whatTypeRow]);

		await interaction.showModal(Modal);
	}
}
module.exports = {
	TicketAddButtonHandler
};
