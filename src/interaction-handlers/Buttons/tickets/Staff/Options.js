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
		if (interaction.customId !== 'staff_option') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		if (!interaction.member.roles.cache.has('883851274179719168'))
			return interaction.reply({
				ephemeral: true,
				content: "You don't have permissions to use this feature."
			});
		const embed = new Discord.EmbedBuilder()
			.setTitle('Staff Options')
			.setDescription("Choose the option you'd like to proceed with:")
			.setColor('DarkButNotBlack');
		let button = new Discord.ButtonBuilder().setCustomId(`general_close`).setStyle(Discord.ButtonStyle.Danger).setLabel('Close');
		let buttonTrans = new Discord.ButtonBuilder().setCustomId(`transcript`).setStyle(Discord.ButtonStyle.Primary).setLabel('Transcript');
		let buttonRemove = new Discord.ButtonBuilder().setCustomId(`remove`).setStyle(Discord.ButtonStyle.Danger).setLabel('Remove User');
		let buttonAdd = new Discord.ButtonBuilder().setCustomId(`add`).setStyle(Discord.ButtonStyle.Primary).setLabel('Add User');
		let row = new Discord.ActionRowBuilder().addComponents([button, buttonTrans, buttonAdd, buttonRemove]);
		interaction.reply({
			ephemeral: true,
			embeds: [embed],
			components: [row]
		});
	}
}
module.exports = {
	TicketAddButtonHandler
};
