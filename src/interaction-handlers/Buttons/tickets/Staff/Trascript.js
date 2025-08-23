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
const { createTranscript } = require('discord-html-transcripts');

class TicketAddButtonHandler extends InteractionHandler {
	constructor(ctx, options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	parse(interaction) {
		if (interaction.customId !== 'transcript') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		await interaction.deferReply({ ephemeral: true })

		const transcript_channel = config.logChannel;
		const log = interaction.guild.channels.cache.get(transcript_channel);
		const attachment = await createTranscript(interaction.channel);
		const embed = new Discord.EmbedBuilder()
			.setTitle('TRANSCRIPT - ' + interaction.channel.name)
			.setDescription('transcript for ' + interaction.channel.name + ' by ' + `<@${interaction.user.id}>`);
		log.send({
			embeds: [embed],
			files: [attachment]
		});
		interaction.editReply({
			ephemeral: true,
			content: 'Transcript has been created.'
		});
	}
}
module.exports = {
	TicketAddButtonHandler
};
