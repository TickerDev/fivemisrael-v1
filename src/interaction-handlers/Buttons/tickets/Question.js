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
		if (interaction.customId !== 'generalqustionsbutton') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		const Modal = new Discord.ModalBuilder().setCustomId('generalqustionsModal').setTitle('Question');
		const serverName = new Discord.TextInputBuilder()
			.setPlaceholder('רשמו פה')
			.setLabel('שם:')
			.setCustomId('namequestion')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);
		const serverDescription = new Discord.TextInputBuilder()
			.setPlaceholder('רשמו פה')
			.setLabel('שאלה:')
			.setCustomId('generalquestionquestion')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const serverNameRow = new Discord.ActionRowBuilder().addComponents(serverName);
		const serverDescriptionRow = new Discord.ActionRowBuilder().addComponents(serverDescription);

		Modal.addComponents([serverNameRow, serverDescriptionRow]);
		await interaction.showModal(Modal);
	}
}
module.exports = {
	TicketAddButtonHandler
};
