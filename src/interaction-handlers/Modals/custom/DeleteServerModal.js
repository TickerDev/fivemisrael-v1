const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ table: 'tickets' });
const Discord = require("discord.js")
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
		await interaction.deferReply({ ephemeral: true })
		const reason = interaction.fields.getTextInputValue('deletereason');
		const { guild } = interaction;
		const options = {
			type: 'GUILD_TEXT'
		};

		if (await db.get(`guild:${guild.id}:user:${interaction.user.id}_ticket`)) {
			const ticket = await db.get(`guild:${guild.id}:user:${interaction.user.id}_ticket`);
			const channel = interaction.guild.channels.cache.get(ticket.channelID);
			if (!channel) await db.delete(`guild:${guild.id}:user:${interaction.user.id}_ticket`);
			else
				return interaction.editReply({
					ephemeral: true,
					content: `**היי יו אחי!**, מה זה אמור להיות? **יש לך טיקט פתוח!** חזור אליו פה <#${channel.id}> *(אם אתה לא רואה את הטיקט פנה לצוות)*`
				});
		}

		let button1 = new Discord.ButtonBuilder().setCustomId(`staff_option`).setStyle(Discord.ButtonStyle.Primary).setLabel('Staff Options');
		let button2 = new Discord.ButtonBuilder().setCustomId(`accept`).setStyle(Discord.ButtonStyle.Success).setLabel('Accept');
		let button3 = new Discord.ButtonBuilder().setCustomId(`decline`).setStyle(Discord.ButtonStyle.Danger).setLabel('Decline');
		const row = new Discord.ActionRowBuilder().addComponents([button1, button2, button3]);
		const ID = Math.floor(Math.random() * 90000) + 10000;
		const transcript_channel = config.logChannel;
		const log = guild.channels.cache.get(transcript_channel);
		if (!log || log === null || log === undefined || log == '') {
			const channel = await interaction.guild.channels.create({
				name: `${interaction.user.username}-מחיקה`,
				reason: 'Created a ticket for ' + interaction.user.username,
				parent: config.tickets.addServers,
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
						id: config.serverListAccess,
						allow: ['ViewChannel']
					}
				]
			});

			const channel1 = interaction.guild.channels.cache.get(interaction.channel.id);
			if (!channel1) return;
			const message1 = await channel1.messages.fetch(await db.get(`server:${interaction.channel.id}.message`));
			if (!message1 || message1 == undefined) {
				return
			}

			const SRole = interaction.guild.roles.cache.find((x) => x.id == config.StaffRoleID);
			const embed = new Discord.EmbedBuilder()
				.setColor(config.embed_color)
				.setTitle(`${channel.name}`)
				.addFields(
					{
						name: 'חדר',
						value: `<#${interaction.channel.id}>`
					},
					{
						name: 'סיבה',
						value: reason
					}
				);
			const message = await channel.send({
				components: [row],
				content: `<@${interaction.user.id}> ${SRole}`,
				embeds: [embed]
			});
			await interaction.editReply({
				content: `${channel}`,
				ephemeral: true
			})
				.then(async () => {
					await db.set(`guild:${guild.id}:user:${interaction.user.id}_ticket`, {
						serverChannel: interaction.channel.id,
						serverOwner: interaction.user.id
					});
					await db.set(`guild:${interaction.guild.id}:channel:${channel.id}`, interaction.user.id);
				});
			return;
		} else {
			const channel = await interaction.guild.channels.create({
				name: `${interaction.user.username}-מחיקה`,
				reason: 'Created a ticket for ' + interaction.user.username,
				parent: config.tickets.addServers,
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
						id: config.serverListAccess,
						allow: ['ViewChannel']
					}
				]
			});

			const channel1 = interaction.guild.channels.cache.get(interaction.channel.id);
			if (!channel1) return;
			const message1 = await channel1.messages.fetch(await db.get(`server:${interaction.channel.id}.message`));
			if (!message1 || message1 == undefined) {
				return
			}

			const SRole = interaction.guild.roles.cache.find((x) => x.id == config.staffRole);

			const embed = new Discord.EmbedBuilder()
				.setColor(config.embed_color)
				.setTitle(`${channel.name}`)
				.addFields(
					{
						name: 'חדר',
						value: `<#${interaction.channel.id}>`
					},
					{
						name: 'סיבה',
						value: reason
					}
				);
			const message = await channel.send({
				components: [row],
				content: `<@${interaction.user.id}> ${SRole}`,
				embeds: [embed]
			});
			await interaction
				.editReply({
					content: `${channel}`,
					ephemeral: true
				})
				.then(async () => {
					await db.set(`guild:${guild.id}:user:${interaction.user.id}_ticket`, {
						serverChannel: interaction.channel.id,
						serverOwner: interaction.user.id
					});
					await db.set(`guild:${interaction.guild.id}:channel:${channel.id}`, interaction.user.id);
				});
		}
	}

	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	parse(interaction) {
		if (interaction.customId !== 'deleteservermodal') return this.none();

		return this.some();
	}
}

module.exports = {
	ModalHandler
};
