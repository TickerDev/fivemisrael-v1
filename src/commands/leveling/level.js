const { Command } = require('@sapphire/framework');
const Discord = require('discord.js');
const Levels = require('discord-xp');
const config = require("../../config")
class UserCommand extends Command {
	/**
	 * @param {Command.LoaderContext} context
	 */
	constructor(context) {
		super(context, {
			// Any Command options you want here
			name: 'level',
			description: 'Fetch your level'
		});
	}

	/**
	 * @param {Command.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	/**
	 * @param {Command.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		let target = await Levels.fetch(interaction.user.id, interaction.guild.id);
		if (!target) target = await Levels.createUser(interaction.user.id, interaction.guildId);
		try {
			const embed = new Discord.EmbedBuilder()
				.setAuthor({
					name: `${interaction.user.username} - info!`,
					iconURL: interaction.member.displayAvatarURL({
						dynamic: true
					})
				})
				.setColor(config.embed_color)
				.setDescription(
					`<@${interaction.user.id}> level is: \`${target.level}\`, <@${interaction.user.id}> XP is: \`${target.xp}/${Levels.xpFor(target.level + 1)}\``
				);
			interaction.reply({
				embeds: [embed]
			});
		} catch (error) {
			console.error();
		}
	}
}

module.exports = {
	UserCommand
};
