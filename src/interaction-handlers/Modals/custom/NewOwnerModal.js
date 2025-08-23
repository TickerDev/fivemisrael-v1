const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ table: 'tickets' });
const client = require("../../../index")
const { EmbedBuilder } = require("discord.js")
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
		await interaction.deferReply({ ephemeral: true })
		const server = await client.db.getServer(interaction.channel.id);
		const serverOwner = String(server.ownerID);
		const NewOwner = interaction.fields.getTextInputValue('newownerid');

		const oldOwner = interaction.guild.members.cache.get(serverOwner);
		const newOwner = interaction.guild.members.cache.get(NewOwner);
		if (!newOwner || newOwner == undefined || NewOwner == null)
			return interaction.editReply({
				ephemeral: true,
				content: 'This person is not in our Discord server.'
			});
		const messages = await interaction.channel.messages.fetch({
			limit: 10
		});
		const msg = await messages.find((m) => m.embeds?.length > 0);
		if (!msg) return interaction.editReply("I can't find this message, please try again or contact `Ticker#5975`.");

		const embed = new EmbedBuilder(msg.embeds[0]);
		const ownerField = embed.data.fields.find((field) => field.name?.toLowerCase().includes('server owner'));
		if (ownerField) {
			ownerField.value = `<@${newOwner.id}>`;
		} else embed.addField('Server Owner', `<@${newOwner.id}>`);
		try {
			if (oldOwner && oldOwner.roles.cache.has(config.OwnerRole)) {
				oldOwner.setNickname(`${oldOwner.user.displayName}`);
				await oldOwner.roles.remove(config.OwnerRole);
			}
		} catch (err) {
			return;
		}

		if (!newOwner.roles.cache.has(config.OwnerRole)) newOwner.roles.add(config.OwnerRole);

		if (newOwner.manageable) await newOwner.setNickname(`${String(server.name)} | ${newOwner.user.displayName}`);
		await msg.edit({
			embeds: [embed],
			content: ' '
		});
		interaction.editReply({
			ephemeral: true,
			content: 'Ownership transfered successfuly to <@' + newOwner.id + '>'
		});

		const obj = {
			guildID: interaction.guild.id,
			channelID: interaction.channelId,
			ownerID: newOwner.id,
			moderatorID: server.moderator_id,
			category: String(server.category).toLowerCase().trim(),
			votes: server.votes,
			name: server.name,
			description: server.description,
			image: server.image,
			invite: server.invite,
			messageId: msg.id
		};
		await client.db.createServer(obj);
		await client.db.deleteServer(interaction.channel.id);
	}

	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	parse(interaction) {
		if (interaction.customId !== 'newownermodal') return this.none();

		return this.some();
	}
}

module.exports = {
	ModalHandler
};
