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
		if (interaction.customId !== 'getapikey') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		try {
			const response = await fetch("https://votes.fivemisrael.com/api/createAuth", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'x-admin-secret': "4774ef1e7388c3dd742bc28621e0360742d86e6d796c71ae71f3b1c0b052ac84"
				},
				body: JSON.stringify({ channelId: interaction.channelId })
			})
			if (!response.ok) {
				const errorData = await response.json();
				this.container.logger.error("Error: ", errorData);
				return interaction.reply({
					ephemeral: true,
					embeds: [
						new Discord.EmbedBuilder()
							.setDescription("We ran into an error, try again later or open a ticket.")
							.setColor(Discord.Colors.Red)
					]
				})
			}
			const data = await response.json();
			return interaction.reply({
				ephemeral: true, embeds: [
					new Discord.EmbedBuilder()
						.setDescription(`Key was created ||${data.key}||\nDo not share this key with anybody.`)
						.setColor(Discord.Colors.Green)

				]
			})
		} catch (error) {
			return this.container.logger.error("Error:", error)
		}
	}
}
module.exports = {
	TicketAddButtonHandler
};
