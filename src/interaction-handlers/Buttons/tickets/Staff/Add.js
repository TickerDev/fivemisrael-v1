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
		if (interaction.customId !== 'add') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		const Modal = new Discord.ModalBuilder();
		Modal.setCustomId('ticket_add');
		Modal.setTitle('Add A User');
		const row = new Discord.ActionRowBuilder().addComponents(
			new Discord.TextInputBuilder() // We create a Text Input Component
				.setCustomId('ticket_add_option')
				.setLabel('Add A User')
				.setStyle(TextInputStyle.Short)
				.setPlaceholder("Type the user's ID in here.")
				.setRequired(true)
		);
		Modal.addComponents([row]);
		await interaction.showModal(Modal);
	}
}
module.exports = {
	TicketAddButtonHandler
};
