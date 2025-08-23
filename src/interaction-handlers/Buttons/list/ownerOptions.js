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
const client = require('../../../index');
const quick = require("quick.db")
const db = new quick.QuickDB({ table: "verified" })
const $db = new quick.QuickDB({ table: "beta" })
class TicketAddButtonHandler extends InteractionHandler {
	constructor(ctx, options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	parse(interaction) {
		if (interaction.customId !== 'owneroptions') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		const server = await client.db.getServer(interaction.channelId);
		console.log(server)
		if (server.owner_id !== interaction.user.id && !interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !interaction.member.roles.cache.has("1067889879100424192")) {
			return interaction.reply({
				ephemeral: true,
				content: 'אין לך גישה לזה!'
			});
		}
		if (interaction.member.roles.cache.has(config.OwnerRole) && !interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
			let deleteButton = new Discord.ButtonBuilder()
				.setCustomId(`deleteserverroom`)
				.setStyle(Discord.ButtonStyle.Danger)
				.setLabel('בקשת מחיקה');
			let GiveOwnership = new Discord.ButtonBuilder()
				.setCustomId(`giveownership`)
				.setStyle(Discord.ButtonStyle.Primary)
				.setLabel('להעביר ניהול');

			const row = new Discord.ActionRowBuilder().addComponents([deleteButton, GiveOwnership]);
			return interaction.reply({
				components: [row],
				ephemeral: true,
				content: 'This is the menu to delete a server, if you delete do not forget to remove the roles from the owner..'
			});

		}
		if (interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
			let edit = new Discord.ButtonBuilder().setCustomId(`editrequestserver`).setStyle(Discord.ButtonStyle.Primary).setLabel('בקשת עריכה');
			let deleteButton = new Discord.ButtonBuilder()
				.setCustomId(`deleteserverroom`)
				.setStyle(Discord.ButtonStyle.Danger)
				.setLabel('בקשת מחיקה');
			let GiveOwnership = new Discord.ButtonBuilder()
				.setCustomId(`giveownership`)
				.setStyle(Discord.ButtonStyle.Primary)
				.setLabel('להעביר ניהול');
			let setVotesMenu = new Discord.ButtonBuilder()
				.setCustomId(`setvotessecretmenu`)
				.setStyle(Discord.ButtonStyle.Secondary)
				.setLabel('Set Votes [Managers Only]');
			let giveVerified = new Discord.ButtonBuilder()
				.setCustomId(`setverified`)
				.setStyle(Discord.ButtonStyle.Secondary)
				.setLabel('Set Verified [Managers Only]');
			let update = new Discord.ButtonBuilder()
				.setCustomId(`updatemessage`)
				.setStyle(Discord.ButtonStyle.Secondary)
				.setLabel('Update Message [Managers Only]');
			let giveBeta = new Discord.ButtonBuilder()
				.setCustomId(`givebeta`)
				.setStyle(Discord.ButtonStyle.Secondary)
				.setLabel('Give Beta [Managers Only]');

			let pinMessage = new Discord.ButtonBuilder()
				.setCustomId(`pinnedmessagebutton`)
				.setStyle(Discord.ButtonStyle.Secondary)
				.setLabel('הצמד הודעה [בטא]');

			let webhookIntergration = new Discord.ButtonBuilder()
				.setCustomId("webtest")
				.setStyle(Discord.ButtonStyle.Primary)
				.setLabel("סדר לוגים");
			let captchaOneDay = new Discord.ButtonBuilder()
				.setCustomId("captchaoneday")
				.setStyle(Discord.ButtonStyle.Primary)
				.setLabel("Captcha [1 Day]");
			let captchaThreeDays = new Discord.ButtonBuilder()
				.setCustomId("captchathreedays")
				.setStyle(Discord.ButtonStyle.Primary)
				.setLabel("Captcha [3 Days]");
			let captchaSevenDays = new Discord.ButtonBuilder()
				.setCustomId("captchasevendays")
				.setStyle(Discord.ButtonStyle.Primary)
				.setLabel("Captcha [7 Days]");
			let GetAPIKey = new Discord.ButtonBuilder()
				.setCustomId("getapikey")
				.setStyle(Discord.ButtonStyle.Primary)
				.setLabel("קבלו מפתח API")

			const row = new Discord.ActionRowBuilder().addComponents([edit, deleteButton, GiveOwnership, webhookIntergration]);
			const secretRow = new Discord.ActionRowBuilder().addComponents([pinMessage, setVotesMenu, giveVerified, update]);
			const yetAnotherRow = new Discord.ActionRowBuilder().addComponents([
				giveBeta, GetAPIKey
			])
			const captchaRow = new Discord.ActionRowBuilder().addComponents([captchaOneDay, captchaThreeDays, captchaSevenDays]);

			return interaction.reply({
				components: [row, secretRow, yetAnotherRow, captchaRow],
				ephemeral: true,
				content: 'This menu is injected with some **_✨personality✨_** for the Managers.'
			});
		}
		if (await db.get(interaction.channelId) || await $db.get(interaction.channelId)) {
			let edit = new Discord.ButtonBuilder().setCustomId(`editrequestserver`).setStyle(Discord.ButtonStyle.Primary).setLabel('בקשת עריכה');
			let deleteButton = new Discord.ButtonBuilder()
				.setCustomId(`deleteserverroom`)
				.setStyle(Discord.ButtonStyle.Danger)
				.setLabel('בקשת מחיקה');
			let GiveOwnership = new Discord.ButtonBuilder()
				.setCustomId(`giveownership`)
				.setStyle(Discord.ButtonStyle.Primary)
				.setLabel('להעביר ניהול');
			let pinMessage = new Discord.ButtonBuilder()
				.setCustomId(`pinnedmessagebutton`)
				.setStyle(Discord.ButtonStyle.Secondary)
				.setLabel('הצמד הודעה [בטא]');
			let webhookIntergration = new Discord.ButtonBuilder()
				.setCustomId("webtest")
				.setStyle(Discord.ButtonStyle.Primary)
				.setLabel("סדר לוגים");
			let GetAPIKey = new Discord.ButtonBuilder()
				.setCustomId("getapikey")
				.setStyle(Discord.ButtonStyle.Primary)
				.setLabel("קבלו מפתח API")
			const row = new Discord.ActionRowBuilder().addComponents([edit, deleteButton, webhookIntergration]);
			const secretRow = new Discord.ActionRowBuilder().addComponents([pinMessage, GetAPIKey]);
			return interaction.reply({
				components: [row, secretRow],
				ephemeral: true,
			});
		}
		//pinnedmessagebutton
		let edit = new Discord.ButtonBuilder().setCustomId(`editrequestserver`).setStyle(Discord.ButtonStyle.Primary).setLabel('בקשת עריכה');
		let deleteButton = new Discord.ButtonBuilder().setCustomId(`deleteserverroom`).setStyle(Discord.ButtonStyle.Danger).setLabel('בקשת מחיקה');
		// let GiveOwnership = new Discord.ButtonBuilder().setCustomId(`giveownership`).setStyle(Discord.ButtonStyle.Primary).setLabel('להעביר ניהול');
		let webhookIntergration = new Discord.ButtonBuilder()
			.setCustomId("webtest")
			.setStyle(Discord.ButtonStyle.Primary)
			.setLabel("סדר לוגים");
		const row = new Discord.ActionRowBuilder().addComponents([edit, deleteButton, webhookIntergration]);
		interaction.reply({
			components: [row],
			ephemeral: true
		});
	}
}
module.exports = {
	TicketAddButtonHandler
};

