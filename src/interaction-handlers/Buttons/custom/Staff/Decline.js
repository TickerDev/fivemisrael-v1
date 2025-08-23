const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../../config');
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
		if (interaction.customId !== 'decline') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		const { guild } = interaction;
		if (!interaction.member.roles.cache.has(config.staffRole))
			return interaction.reply({
				ephemeral: true,
				content: 'אין לך גישה לזה!'
			});
		const Modal = new Discord.ModalBuilder().setCustomId('declineserver').setTitle('Decline Server Request');
		const test = new Discord.TextInputBuilder()
			.setPlaceholder('רשמו פה')
			.setLabel('Why decline?')
			.setCustomId('whydecline')
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);
		const row = new Discord.ActionRowBuilder().setComponents([test]);
		Modal.addComponents([row]);
		await interaction.showModal(Modal);
	}
}
module.exports = {
	TicketAddButtonHandler
};
