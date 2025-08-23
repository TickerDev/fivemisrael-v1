const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ table: 'tickets' });
const Discord = require("discord.js")
const client = require('../../../index');
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
		const { guild, channel } = interaction;

		const ownerId = await db.get(`guild:${interaction.guild.id}:channel:${channel.id}`);
		const ticket = await db.get(`guild:${guild.id}:user:${ownerId}_ticket`);
		let serverDescription1 = interaction.fields.getTextInputValue('serverdescriptionquestion');
		let serverImg1 = interaction.fields.getTextInputValue('serverimg');
		let serverInvite1 = interaction.fields.getTextInputValue('serverinvite');
		let nameResponse1 = interaction.fields.getTextInputValue('namequestion');
		let WhatType1 = interaction.fields.getTextInputValue('whattype');
		if (!String(nameResponse1) || String(nameResponse1) == undefined || String(nameResponse1) == null || String(nameResponse1) == '')
			nameResponse1 = ticket.name;
		if (
			!String(serverDescription1) ||
			String(serverDescription1) == undefined ||
			String(serverDescription1) == null ||
			String(nameResponse1) == ''
		)
			serverDescription1 = ticket.description;
		if (!String(serverImg1) || String(serverImg1) == undefined || String(serverImg1) == null || String(nameResponse1) == '')
			serverImg1 = ticket.image;
		if (!String(serverInvite1) || String(serverInvite1) == undefined || String(serverInvite1) == null || String(nameResponse1) == '')
			serverInvite1 = ticket.invite;
		if (!String(WhatType1) || String(WhatType1) == undefined || String(WhatType1) == null || String(nameResponse1) == '')
			WhatType1 = ticket.category;
		const SRole = interaction.guild.roles.cache.find((x) => x.id == config.StaffRoleID);

		function isValidURL(string) {
			var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
			return res !== null;
		}
		if (!isValidURL(serverImg1))
			return interaction.reply({
				ephemeral: true,
				content: 'Image has to be a URL.'
			});
		let regexDiscord = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[a-z]/g;
		if (!regexDiscord.test(serverInvite1))
			return interaction.reply({
				ephemeral: true,
				content: 'Invite has to be a Discord domain.'
			});
		// if (WhatType1.toLowerCase() !== "public" && WhatType1.toLowerCase() !== "whitelist" && WhatType1.toLowerCase() !== "allowlist" && WhatType1.toLowerCase() !== "hosting" && WhatType1.toLowerCase() !== "shop" && WhatType1.toLowerCase() !== "fun") return interaction.reply({
		//     ephemeral: true,
		//     content: "Category must be one of the following: Public/Allowlist/Whitelist/Fun/Hosting/Shop."
		// })

		let button1 = new Discord.ButtonBuilder().setCustomId(`staff_option`).setStyle(Discord.ButtonStyle.Primary).setLabel('Staff Options');
		let button2 = new Discord.ButtonBuilder().setCustomId(`accept`).setStyle(Discord.ButtonStyle.Success).setLabel('Accept');
		let button3 = new Discord.ButtonBuilder().setCustomId(`decline`).setStyle(Discord.ButtonStyle.Danger).setLabel('Decline');
		let button4 = new Discord.ButtonBuilder().setCustomId(`editform`).setStyle(Discord.ButtonStyle.Primary).setLabel('Edit Form');
		const row = new Discord.ActionRowBuilder().addComponents([button1, button2, button3, button4]);
		const channel1 = guild.channels.cache.get(ticket.channelID);

		if (!channel1) return interaction.reply('Did not find channel');
		const message = await channel1.messages.fetch(ticket.messageId);
		if (!message || message == undefined) {
			return
		}

		const embed = new Discord.EmbedBuilder()
			.setColor(config.embed_color)
			.setTitle(`${channel.name}`)
			.setFields(
				{
					name: 'שם',
					value: String(nameResponse1)
				},
				{
					name: 'תיאור השרת',
					value: String(serverDescription1)
				},
				{
					name: 'תמונת השרת',
					value: String(serverImg1)
				},
				{
					name: 'קישור לשרת',
					value: String(serverInvite1)
				},
				{
					name: 'סוג שרת',
					value: String(WhatType1).toLowerCase()
				}
			);

		try {
			await interaction.message.edit({
				embeds: [embed],
				components: [row],
				content: `<@${ownerId}> ${SRole}`
			});

			interaction.reply({
				content: 'Edited ticket Succesfully!',
				ephemeral: true
			});

			await db.set(`guild:${guild.id}:user:${ownerId}_ticket`, {
				channelID: channel1.id,
				ownerID: ownerId,
				name: nameResponse1,
				messageId: message.id,
				description: serverDescription1,
				image: serverImg1,
				invite: serverInvite1,
				category: String(WhatType1).toLowerCase().trim()
			});
		} catch (error) {
			return;
		}
	}

	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	parse(interaction) {
		if (interaction.customId !== 'addserveredit') return this.none();
		return this.some();
	}
}

module.exports = {
	ModalHandler
};

