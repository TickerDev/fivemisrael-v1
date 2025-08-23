const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ table: 'tickets' });
const Discord = require('discord.js');
const client = require('../../../index');
class ModalHandler extends InteractionHandler {
	/**
	 * @param {InteractionHandler.LoaderContext} context
	 * @param {InteractionHandler.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.ModalSubmit
		});
	}

	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	async run(interaction) {
		const { guild, channel } = interaction;
		const ID = await db.get(`guild:${guild.id}.ticketChannel:${channel.id}.ID`);
		const ownerId = await db.get(`guild:${interaction.guild.id}:channel:${interaction.channel.id}`);
		const ticket = await db.get(`guild:${guild.id}:user:${ownerId}_ticket`);
		let nameResponse = interaction.fields.getTextInputValue('namequestion');
		let id = interaction.fields.getTextInputValue('idquestion');
		let reason = interaction.fields.getTextInputValue('reasonquestion');
		let evidence = interaction.fields.getTextInputValue('evidence');
		let evidence2 = interaction.fields.getTextInputValue('evidence2');
		const channel1 = guild.channels.cache.get(ticket.channelID);

		if (!channel1) return;
		const message = await channel1.messages.fetch(ticket.messageId);
		if (!message || message == undefined) {
			return;
		}
		if (!String(nameResponse) || String(nameResponse) == undefined || String(nameResponse) == null) nameResponse = ticket.name;
		if (!id || id == undefined || id == null) id = ticket.blacklistId;
		if (!String(reason) || String(reason) == undefined || String(reason) == null) reason = ticket.reason;
		if (!String(evidence) || String(evidence) == undefined || String(evidence) == null) evidence = ticket.evidence;

		if (evidence2 == undefined || evidence2 == null || !typeof evidence2 == 'string') {
			// * checking if user entered a new evidence
			if (!ticket.evidence2 || ticket.evidence2 == undefined || ticket.evidence2 == null || !typeof evidence2 == 'string') {
				// * checking if there is an existing evidence
				const SRole = interaction.guild.roles.cache.find((x) => x.id == config.StaffRoleID);
				let button1 = new Discord.ButtonBuilder().setCustomId(`staff_option`).setStyle(Discord.ButtonStyle.Primary).setLabel('Staff Options');
				let button2 = new Discord.ButtonBuilder().setCustomId(`accept`).setStyle(Discord.ButtonStyle.Success).setLabel('Accept');
				let button3 = new Discord.ButtonBuilder().setCustomId(`decline`).setStyle(Discord.ButtonStyle.Danger).setLabel('Decline');
				let button4 = new Discord.ButtonBuilder().setCustomId(`editform`).setStyle(Discord.ButtonStyle.Primary).setLabel('Edit Form');
				const row = new Discord.ActionRowBuilder().addComponents([button1, button2, button3, button4]);

				const embed = new Discord.EmbedBuilder()
					.setColor(config.embed_color)
					.setTitle(`${channel.name}`)
					.addFields(
						{
							name: 'שם מקבל הבלאקליסט',
							value: String(nameResponse)
						},
						{
							name: 'איידי של מקבל הבלאקליסט',
							value: String(id)
						},
						{
							name: 'סיבה לקבלת הבלאקליסט',
							value: String(reason)
						},
						{
							name: 'הוכחות',
							value: `[לחצו פה](${evidence})`
						}
					);

				await message.edit({
					embeds: [embed],
					components: [row],
					content: `<@${ownerId}> ${SRole}`
				});
				interaction.channel.send({
					content: ' Edited ticket Succesfully! Edit was done by <@' + interaction.user.id + '>'
				});
				interaction.reply({
					content: 'Done',
					ephemeral: true
				});
				await db.set(`guild:${guild.id}:user:${ownerId}_ticket`, {
					channelID: channel.id,
					ownerID: ownerId,
					messageId: message.id,
					name: String(nameResponse),
					blacklistId: id,
					reason: reason,
					evidence: evidence
				});

				return;
			} else {
				const SRole = interaction.guild.roles.cache.find((x) => x.id == config.StaffRoleID);
				let button1 = new Discord.ButtonBuilder().setCustomId(`staff_option`).setStyle(Discord.ButtonStyle.Primary).setLabel('Staff Options');
				let button2 = new Discord.ButtonBuilder().setCustomId(`accept`).setStyle(Discord.ButtonStyle.Success).setLabel('Accept');
				let button3 = new Discord.ButtonBuilder().setCustomId(`decline`).setStyle(Discord.ButtonStyle.Danger).setLabel('Decline');
				let button4 = new Discord.ButtonBuilder().setCustomId(`editform`).setStyle(Discord.ButtonStyle.Primary).setLabel('Edit Form');
				const row = new Discord.ActionRowBuilder().addComponents([button1, button2, button3, button4]);

				const embed = new Discord.EmbedBuilder()
					.setColor(config.embed_color)
					.setTitle(`${channel.name}`)
					.addFields(
						{
							name: 'שם מקבל הבלאקליסט',
							value: String(nameResponse)
						},
						{
							name: 'איידי של מקבל הבלאקליסט',
							value: String(id)
						},
						{
							name: 'סיבה לקבלת הבלאקליסט',
							value: String(reason)
						},
						{
							name: 'הוכחות',
							value: `[לחצו פה](${evidence}), [לחצו פה](${ticket.evidence2})`
						}
					);

				await message.edit({
					embeds: [embed],
					components: [row],
					content: `<@${ownerId}> ${SRole}`
				});
				interaction.channel.send({
					content: ' Edited ticket Succesfully! Edit was done by <@' + interaction.user.id + '>'
				});
				interaction.reply({
					content: 'Done',
					ephemeral: true
				});
				let cachedEvidence2 = ticket.evidence2;
				await db.set(`guild:${guild.id}:user:${ownerId}_ticket`, {
					channelID: channel.id,
					ownerID: ownerId,
					messageId: message.id,
					name: String(nameResponse),
					blacklistId: id,
					reason: reason,
					evidence: evidence,
					evidence2: cachedEvidence2
				});
				return;
			}
		} else {
			const SRole = interaction.guild.roles.cache.find((x) => x.id == config.StaffRoleID);
			let button1 = new Discord.ButtonBuilder().setCustomId(`staff_option`).setStyle(Discord.ButtonStyle.Primary).setLabel('Staff Options');
			let button2 = new Discord.ButtonBuilder().setCustomId(`accept`).setStyle(Discord.ButtonStyle.Success).setLabel('Accept');
			let button3 = new Discord.ButtonBuilder().setCustomId(`decline`).setStyle(Discord.ButtonStyle.Danger).setLabel('Decline');
			let button4 = new Discord.ButtonBuilder().setCustomId(`editform`).setStyle(Discord.ButtonStyle.Primary).setLabel('Edit Form');
			const row = new Discord.ActionRowBuilder().addComponents([button1, button2, button3, button4]);

			const embed = new Discord.EmbedBuilder()
				.setColor(config.embed_color)
				.setTitle(`${channel.name}`)
				.addFields(
					{
						name: 'שם מקבל הבלאקליסט',
						value: String(nameResponse)
					},
					{
						name: 'איידי של מקבל הבלאקליסט',
						value: String(id)
					},
					{
						name: 'סיבה לקבלת הבלאקליסט',
						value: String(reason)
					},
					{
						name: 'הוכחות',
						value: `[לחצו פה](${evidence}), [לחצו פה](${evidence2})`
					}
				);

			await interaction.message.edit({
				embeds: [embed],
				components: [row],
				content: `<@${ownerId}> ${SRole}`
			});
			interaction.channel.send({
				content: ' Edited ticket Succesfully! Edit was done by <@' + interaction.user.id + '>'
			});
			interaction.reply({
				content: 'Done',
				ephemeral: true
			});
			await db.set(`guild:${guild.id}:user:${ownerId}_ticket`, {
				channelID: channel.id,
				ownerID: ownerId,
				messageId: message.id,
				name: String(nameResponse),
				blacklistId: id,
				reason: reason,
				evidence: evidence,
				evidence2: evidence2
			});
		}
	}

	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	parse(interaction) {
		if (interaction.customId !== 'blacklistedit') return this.none();

		return this.some();
	}
}

module.exports = {
	ModalHandler
};
