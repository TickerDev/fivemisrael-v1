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
const quick = require("quick.db").QuickDB;
const db = new quick({ table: "memberroles" })

class TicketAddButtonHandler extends InteractionHandler {
	constructor(ctx, options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	parse(interaction) {
		if (interaction.customId !== 'verify') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		try {
			const role = interaction.guild.roles.cache.get(config.verifyRole);
			if (interaction.member.roles.cache.has(role.id))
				return interaction.reply({
					content: 'אומתת כבר!',
					ephemeral: true
				});
			interaction.member.roles.add(role);
			const roles = await db.get(`${interaction.guildId}.${interaction.user.id}.roles`);
			if (roles) {
				for (const roleId of roles) {
					const role = interaction.guild.roles.cache.get(roleId);
					if (role) {
						await interaction.member.roles.add(role);
					}
				}
				return interaction.reply({
					ephemeral: true,
					content: 'מזל טוב! אומתת בשרת שלנו, עכשיו אתה יכול לגשת לשאר'
				});

			} else {
				return interaction.reply({
					ephemeral: true,
					content: 'מזל טוב! אומתת בשרת שלנו, עכשיו אתה יכול לגשת לשאר'
				});

			}

		} catch (error) {
			return []
		}
	}
}
module.exports = {
	TicketAddButtonHandler
};
