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
		if (interaction.customId !== 'giveownership') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		const server = await client.db.getServer(interaction.channelId);
		if (server.owner_id !== interaction.user.id && !interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
			return interaction.reply({
				ephemeral: true,
				content: 'אין לך גישה לזה!'
			});
		}
		const Modal = new Discord.ModalBuilder().setCustomId('newownermodal').setTitle('העברת בעלות');
		const NewOwner = new Discord.TextInputBuilder()
			.setPlaceholder('לדוגמה: 428616048640786433')
			.setLabel('איידי של הבעלים החדש:')
			.setCustomId('newownerid')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);
		const NewOwnerRow = new Discord.ActionRowBuilder().addComponents(NewOwner);

		Modal.addComponents([NewOwnerRow]);
		await interaction.showModal(Modal);
	}
}
module.exports = {
	TicketAddButtonHandler
};
