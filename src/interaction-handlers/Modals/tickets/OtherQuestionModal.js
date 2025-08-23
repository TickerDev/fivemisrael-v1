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
		let button1 = new Discord.ButtonBuilder().setCustomId(`staff_option`).setStyle(Discord.ButtonStyle.Primary).setLabel('Staff Options');
		const row = new Discord.ActionRowBuilder().addComponents([button1]);
		const ID = Math.floor(Math.random() * 90000) + 10000;
		const transcript_channel = config.logChannel;
		const log = guild.channels.cache.get(transcript_channel);
		const channel = await interaction.guild.channels.create({
			name: `${interaction.user.username}-אחר`,
			reason: 'Created a ticket for ' + interaction.user.username,
			parent: config.tickets.others,
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
		const reasonResponse = interaction.fields.getTextInputValue('requestquestion');

		const SRole = interaction.guild.roles.cache.find((x) => x.id == config.staffRole);

		const embed2 = new Discord.EmbedBuilder().setColor(config.embed_color).setTitle(`${channel.name}`).addFields(
			{
				name: 'שם',
				value: nameResponse
			},
			{
				name: 'סיבה',
				value: reasonResponse
			}
		);
		channel.send({
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
					ownerID: interaction.user.id
				});
				await db.set(`guild:${interaction.guild.id}:channel:${channel.id}`, interaction.user.id);
			});
	}
	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	parse(interaction) {
		if (interaction.customId !== 'otherquestionModal') return this.none();

		return this.some();
	}
}
module.exports = {
	ModalHandler
};
