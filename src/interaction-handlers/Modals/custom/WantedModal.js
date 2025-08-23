const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ table: 'cooldowns' });
const client = require('../../../index');
const humanizeDuration = require('humanize-duration');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
	humanize(ms) {
		return humanizeDuration(ms, {
			//units: ['ימים', 'שעות', 'דקות', 'שניות'],
			round: true,
			conjunction: ' ו ',
			serialComma: false,
			language: "he"
		});
	}

	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	async run(interaction) {
		const { user } = interaction;
		const member = interaction.guild.members.cache.get(user.id);
		if(member.roles.cache.has("955411849707388948")) return;
		const declinereason = interaction.fields.getTextInputValue('explainfurtherwanted');
		const cooldown = await db.get(`${interaction.customId}.${user.id}`);
		const memberIsBooster = interaction.member.premiumSince;
		const cooldownTime = memberIsBooster ? Number(60 * 60 * 1 * 1000) : Number(60 * 60 * 4 * 1000);

		if (cooldown !== null && cooldownTime - (Date.now() - cooldown) > 0) {
			const timeLeft = cooldownTime - (Date.now() - Number(cooldown));

			return await interaction.reply({
				ephemeral: true,
				content: `אתה צריך להמתין **${this.humanize(timeLeft)}** לפני שתוכל לחפש מחדש.`
			});
		} else await db.set(`${interaction.customId}.${user.id}`, Date.now());

		function hasLink(text) {
			// Regular expression pattern to match URLs
			var urlPattern = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/i;

			// Test the pattern against the input text
			if (urlPattern.test(text)) {
				return true;
			} else {
				return false;
			}
		}

		if (hasLink(declinereason)) return interaction.reply({ ephemeral: true, content: `אין לשים קישורים בהודעה שלך!\n\nההודעה שכתבת: \`\`\`${declinereason} \`\`\`` });
		const embed = new Discord.EmbedBuilder()
			.setAuthor({
				name: `${interaction.user.username} - דרוש`,
				iconURL: interaction.user.displayAvatarURL({
					dynamic: true
				})
			})
			.setColor('Green')
			.setDescription(declinereason)
			.addFields({
				name: 'לפניות',
				value: `<@${interaction.user.id}>`
			});
		interaction.guild.channels.cache
			.find((c) => c.id == config.findajobchannel)
			.send({
				embeds: [embed],
			});
		interaction.reply({
			content: `**נשלח! צפה פה <#${config.findajobchannel}>**`,
			ephemeral: true
		});
	}

	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	parse(interaction) {
		if (interaction.customId !== 'wantedModal') return this.none();
		return this.some();
	}
}

module.exports = {
	ModalHandler
};
