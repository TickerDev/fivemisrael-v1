const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ table: 'tickets' });
const Discord = require('discord.js');

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
		const { guild } = interaction;
		if (await db.get(`guild:${guild.id}:user:${interaction.user.id}_ticket`)) {
			const ticket = await db.get(`guild:${guild.id}:user:${interaction.user.id}_ticket`);
			const channel = guild.channels.cache.get(ticket.channelID);
			if (!channel) await db.delete(`guild:${guild.id}:user:${interaction.user.id}_ticket`);
			else
				return interaction.reply({
					ephemeral: true,
					content: `**היי יו אחי!**, מה זה אמור להיות? **יש לך טיקט פתוח!** חזור אליו פה <#${channel.id}> *(אם אתה לא רואה את הטיקט פנה לצוות)*`
				});
		}
		const options = {
			type: 'GUILD_TEXT'
		};
		let button1 = new Discord.ButtonBuilder().setCustomId(`staff_option`).setStyle(Discord.ButtonStyle.Primary).setLabel('Staff Options');
		let button2 = new Discord.ButtonBuilder().setCustomId(`accept`).setStyle(Discord.ButtonStyle.Success).setLabel('Accept');
		let button3 = new Discord.ButtonBuilder().setCustomId(`decline`).setStyle(Discord.ButtonStyle.Danger).setLabel('Decline');
		let button4 = new Discord.ButtonBuilder().setCustomId(`editform`).setStyle(Discord.ButtonStyle.Primary).setLabel('Edit Form');
		const row = new Discord.ActionRowBuilder().addComponents([button1, button2, button3, button4]);
		const transcript_channel = config.logChannel;
		const log = guild.channels.cache.get(transcript_channel);
		const nameResponse = interaction.fields.getTextInputValue('namequestion');
		const id = interaction.fields.getTextInputValue('idquestion');
		const reason = interaction.fields.getTextInputValue('reasonquestion');
		const evidence = interaction.fields.getTextInputValue('evidence');
		const evidence2 = interaction.fields.getTextInputValue('evidence2');
		if (!evidence2 || evidence2 == '' || evidence2 === undefined || evidence2 === null) {
			if (!log || log === null || log === undefined || log == '') {
				//evidence

				const channel = await interaction.guild.channels.create({
					name: `${interaction.user.username}-בלאקליסט`,
					reason: 'Created a ticket for ' + interaction.user.username,
					parent: config.tickets.blacklist,
					permissionOverwrites: [
						{
							id: interaction.user.id,
							allow: ['ViewChannel']
						},
						{
							id: interaction.guild.roles.everyone,
							deny: ['ViewChannel']
						},
						{
							id: config.staffRole,
							allow: ['ViewChannel']
						}
					]
				});
				const SRole = interaction.guild.roles.cache.find((x) => x.id == config.staffRole);

				const embed = new Discord.EmbedBuilder()
					.setColor(config.embed_color)
					.setTitle(`${channel.name}`)
					.addFields(
						{
							name: 'שם מקבל הבלאקליסט',
							value: nameResponse
						},
						{
							name: 'איידי של מקבל הבלאקליסט',
							value: id
						},
						{
							name: 'סיבה לקבלת הבלאקליסט',
							value: reason
						},
						{
							name: 'הוכחות',
							value: `[לחצו פה](${String(evidence)})`
						}
					);
				const message = await channel.send({
					components: [row],
					embeds: [embed],
					content: `<@${interaction.user.id}> ${SRole}`
				});
				await interaction
					.reply({
						content: `${channel}`,
						ephemeral: true
					})
					.then(async () => {
						await db.set(`guild:${guild.id}:user:${interaction.user.id}_ticket`, {
							channelID: channel.id,
							ownerID: interaction.member.id,
							messageId: message.id,
							name: String(nameResponse),
							blacklistId: id,
							reason: reason,
							evidence: evidence
						});
						await db.set(`guild:${guild.id}:channel:${channel.id}`, interaction.user.id);
					});
				return;
			} else {
				const channel = await interaction.guild.channels.create({
					name: `${interaction.user.username}-בלאקליסט`,
					reason: 'Created a ticket for ' + interaction.user.username,
					parent: config.tickets.blacklist,
					permissionOverwrites: [
						{
							id: interaction.user.id,
							allow: ['ViewChannel']
						},
						{
							id: interaction.guild.roles.everyone,
							deny: ['ViewChannel']
						},
						{
							id: config.staffRole,
							allow: ['ViewChannel']
						}
					]
				});

				const nameResponse = interaction.fields.getTextInputValue('namequestion');
				const id = interaction.fields.getTextInputValue('idquestion');
				const reason = interaction.fields.getTextInputValue('reasonquestion');
				const evidence = interaction.fields.getTextInputValue('evidence');

				const SRole = interaction.guild.roles.cache.find((x) => x.id == config.staffRole);

				const embed2 = new Discord.EmbedBuilder()
					.setColor(config.embed_color)
					.setTitle(`${channel.name}`)
					.addFields(
						{
							name: 'שם מקבל הבלאקליסט',
							value: nameResponse
						},
						{
							name: 'איידי של מקבל הבלאקליסט',
							value: id
						},
						{
							name: 'סיבה לקבלת הבלאקליסט',
							value: reason
						},
						{
							name: 'הוכחות',
							value: `[לחצו פה](${String(evidence)})`
						}
					);
				const message = await channel.send({
					components: [row],
					embeds: [embed2],
					content: `<@${interaction.user.id}> ${SRole}`
				});
				await interaction
					.reply({
						content: `${channel}`,
						ephemeral: true
					})
					.then(async () => {
						await db.set(`guild:${guild.id}:user:${interaction.user.id}_ticket`, {
							channelID: channel.id,
							ownerID: interaction.member.id,
							messageId: message.id,
							name: String(nameResponse),
							blacklistId: id,
							reason: reason,
							evidence: evidence
						});
						await db.set(`guild:${guild.id}:channel:${channel.id}`, interaction.user.id);
					});
				return;
			}
		}
		if (!log || log === null || log === undefined || log == '') {
			//evidence

			const channel = await interaction.guild.channels.create({
				name: `${interaction.user.username}-בלאקליסט`,
				reason: 'Created a ticket for ' + interaction.user.username,
				parent: config.tickets.blacklist,
				permissionOverwrites: [
					{
						id: interaction.user.id,
						allow: ['ViewChannel']
					},
					{
						id: interaction.guild.roles.everyone,
						deny: ['ViewChannel']
					},
					{
						id: config.staffRole,
						allow: ['ViewChannel']
					}
				]
			});

			const SRole = interaction.guild.roles.cache.find((x) => x.id == config.staffRole);

			const embed = new Discord.EmbedBuilder()
				.setColor(config.embed_color)
				.setTitle(`${channel.name}`)
				.addFields(
					{
						name: 'שם מקבל הבלאקליסט',
						value: nameResponse
					},
					{
						name: 'איידי של מקבל הבלאקליסט',
						value: id
					},
					{
						name: 'סיבה לקבלת הבלאקליסט',
						value: reason
					},
					{
						name: 'הוכחות',
						value: `[לחצו פה](${String(evidence)}), [לחצו פה](${String(evidence2)})`
					}
				);
			const message = await channel.send({
				components: [row],
				embeds: [embed],
				content: `<@${interaction.user.id}> ${SRole}`
			});
			await interaction
				.reply({
					content: `${channel}`,
					ephemeral: true
				})
				.then(async () => {
					await db.set(`guild:${guild.id}:user:${interaction.user.id}_ticket`, {
						channelID: channel.id,
						ownerID: interaction.member.id,
						messageId: message.id,
						name: String(nameResponse),
						blacklistId: id,
						reason: reason,
						evidence: evidence,
						evidence2: evidence2
					});

					await db.set(`guild:${guild.id}:channel:${channel.id}`, interaction.user.id);
				});
			return;
		} else {
			const channel = await interaction.guild.channels.create({
				name: `${interaction.user.username}-בלאקליסט`,
				reason: 'Created a ticket for ' + interaction.user.username,
				parent: config.tickets.blacklist,
				permissionOverwrites: [
					{
						id: interaction.user.id,
						allow: ['ViewChannel']
					},
					{
						id: interaction.guild.roles.everyone,
						deny: ['ViewChannel']
					},
					{
						id: config.staffRole,
						allow: ['ViewChannel']
					}
				]
			});
			const nameResponse = interaction.fields.getTextInputValue('namequestion');
			const id = interaction.fields.getTextInputValue('idquestion');
			const reason = interaction.fields.getTextInputValue('reasonquestion');
			const evidence = interaction.fields.getTextInputValue('evidence');

			const SRole = interaction.guild.roles.cache.find((x) => x.id == config.staffRole);

			const embed2 = new Discord.EmbedBuilder()
				.setColor(config.embed_color)
				.setTitle(`${channel.name}`)
				.addFields(
					{
						name: 'שם מקבל הבלאקליסט',
						value: nameResponse
					},
					{
						name: 'איידי של מקבל הבלאקליסט',
						value: id
					},
					{
						name: 'סיבה לקבלת הבלאקליסט',
						value: reason
					},
					{
						name: 'הוכחות',
						value: `[לחצו פה](${String(evidence)}), [לחצו פה](${String(evidence2)})`
					}
				);
			const message = await channel.send({
				components: [row],
				embeds: [embed2],
				content: `<@${interaction.user.id}> ${SRole}`
			});
			await interaction
				.reply({
					content: `${channel}`,
					ephemeral: true
				})
				.then(async () => {
					await db.set(`guild:${guild.id}:user:${interaction.user.id}_ticket`, {
						channelID: channel.id,
						ownerID: interaction.member.id,
						messageId: message.id,
						name: String(nameResponse),
						blacklistId: id,
						reason: reason,
						evidence: evidence,
						evidence2: evidence2
					});
					await db.set(`guild:${guild.id}:channel:${channel.id}`, interaction.user.id);
				});
		}
	}
	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	parse(interaction) {
		if (interaction.customId !== 'suggestblacklistModal') return this.none();

		return this.some();
	}
}
module.exports = {
	ModalHandler
};
