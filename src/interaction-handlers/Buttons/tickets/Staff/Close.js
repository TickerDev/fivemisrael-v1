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
const quick = require('quick.db');
const db = new quick.QuickDB({ table: 'tickets' });
const { createTranscript } = require('discord-html-transcripts');
const client = require('../../../../index')
class TicketAddButtonHandler extends InteractionHandler {
	constructor(ctx, options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	parse(interaction) {
		if (interaction.customId !== 'general_close') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		await interaction.deferReply()
		const { guild, channel } = interaction;
		const ownerId = await db.get(`guild:${interaction.guild.id}:channel:${interaction.channel.id}`);

		const transcript_channel = config.logChannel;
		const log = guild.channels.cache.get(transcript_channel);
		if (!log || log === null || log === undefined || log == '') {
			const iEmbed = new Discord.EmbedBuilder()
				.setAuthor({
					name: `${interaction.channel.name} has been deleted`
				})
				.setDescription(`${interaction.channel.name} is deleted by <@${interaction.user.id}>, it will fully close in 5 seconds`)
				.setFooter({
					text: interaction.guild.name + ' Powered by ' + client.user.tag,
					iconURL: interaction.guild.members.me.displayAvatarURL()
				})
				.setColor('Red');

			interaction.editReply({
				embeds: [iEmbed]
			});
			try {
				await db.delete(`guild:${interaction.guild.id}:user:${String(ownerId)}_ticket`);
				await db.delete(`guild:${interaction.guild.id}:channel:${interaction.channel.id}`);
			} catch (error) {
				return;
			}

			setTimeout(() => {
				interaction.channel.delete();
			}, 5000);
			return;
		} else {
			const logEmbed = new Discord.EmbedBuilder()
				.setAuthor({
					name: `${interaction.channel.name} is deleted`
				})
				.setDescription(`${interaction.channel.name} got deleted by <@${interaction.user.id}>`)
				.setFooter({
					text: interaction.guild.name + ' Powered by ' + client.user.tag,
					iconURL: interaction.guild.members.me.displayAvatarURL()
				})
				.setColor('Red');
			const attachment = await createTranscript(interaction.channel, {
				limit: -1,
				returnBuffer: false,
				saveImages: true,
				fileName: 'transcript.html'
			});
			const embed = new Discord.EmbedBuilder()
				.setTitle('TRANSCRIPT - ' + interaction.channel.name)
				.setDescription('transcript for ' + interaction.channel.name + ' by ' + `<@${interaction.user.id}>`);

			log.send({
				embeds: [logEmbed, embed],
				files: [attachment]
			});
			const iEmbed = new Discord.EmbedBuilder()
				.setAuthor({
					name: `${interaction.channel.name} has been deleted`
				})
				.setDescription(`${interaction.channel.name} is deleted by <@${interaction.user.id}>, it will fully close in 5 seconds`)
				.setFooter({
					text: interaction.guild.name + ' Powered by ' + client.user.tag,
					iconURL: interaction.guild.members.me.displayAvatarURL()
				})
				.setColor('Red');

			interaction.editReply({
				embeds: [iEmbed]
			});
			try {
				await db.delete(`guild:${interaction.guild.id}:user:${String(ownerId)}_ticket`);
				await db.delete(`guild:${interaction.guild.id}:channel:${interaction.channel.id}`);
			} catch (error) {
				return;
			}
			setTimeout(() => {
				interaction.channel.delete();
			}, 5000);
		}
	}
}
module.exports = {
	TicketAddButtonHandler
};
