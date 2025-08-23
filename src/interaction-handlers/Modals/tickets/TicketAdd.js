const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');

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
		const nameResponse = interaction.fields.getTextInputValue('ticket_add_option');
		const userToAdd = interaction.guild.members.cache.get(String(nameResponse));
		if (!userToAdd || userToAdd === null || userToAdd === undefined)
			return interaction.reply({
				ephemeral: true,
				content: `ID: ${nameResponse} does not issue to a user in the server`
			});
		interaction.channel.permissionOverwrites.edit(userToAdd.id, {
			ViewChannel: true,
			SendMessages: true
		});
		interaction.reply(`Added ${userToAdd} to ${interaction.channel.name}`);
	}

	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	parse(interaction) {
		if (interaction.customId !== 'ticket_add') return this.none();

		return this.some();
	}
}

module.exports = {
	ModalHandler
};
