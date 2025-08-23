const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ table: 'tickets' });
const client = require('../../../index');
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
		const declinereason = interaction.fields.getTextInputValue('whydecline');
		const embed = new Discord.EmbedBuilder()
			.setTitle('בקשה נדחתה!')
			.setColor('Red')
			.setDescription(`בקשתך נדחת על ידי <@${interaction.user.id}>.`)
			.addFields({
				name: 'סיבה',
				value: declinereason
			});
		interaction.reply({
			embeds: [embed]
		});
	}

	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	parse(interaction) {
		if (interaction.customId !== 'declineserver') return this.none();
		return this.some();
	}
}

module.exports = {
	ModalHandler
};
