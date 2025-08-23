const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../config');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ table: 'tickets' });
const client = require('../../../index');
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
		const { guild, channel } = interaction;

		if (await db.get(`guild:${guild.id}:user:${interaction.user.id}_ticket`)) {
			const ticket = await db.get(`guild:${guild.id}:user:${interaction.user.id}_ticket`);
			const channel = guild.channels.cache.get(ticket.channelID);
			if (!channel) await db.delete(`guild:${guild.id}:user:${interaction.user.id}_ticket`);
			else
				return interaction.editReply({
					ephemeral: true,
					content: `**היי יו אחי!**, מה זה אמור להיות? **יש לך טיקט פתוח!** חזור אליו פה <#${channel.id}> *(אם אתה לא רואה את הטיקט פנה לצוות)*`
				});
		}

		const server = await client.db.getServer(channel.id);
		const serverName = String(server.name);
		const serverDescription = String(server.description);
		const serverImg = String(server.image);
		const serverInv = String(server.invite);
		const whatType = String(server.category);
		let nameResponse1 = interaction.fields.getTextInputValue('namequestion');
		let serverDescription1 = interaction.fields.getTextInputValue('serverdescriptionquestion');
		let serverImg1 = interaction.fields.getTextInputValue('serverimg');
		let serverInvite1 = interaction.fields.getTextInputValue('serverinvite');
		//let WhatType1 = interaction.fields.getTextInputValue('whattype');
		let WhatType1 = whatType;
		if (!String(nameResponse1) || String(nameResponse1) == undefined || String(nameResponse1) == null || String(nameResponse1) == '')
			nameResponse1 = String(serverName);
		if (
			!String(serverDescription1) ||
			String(serverDescription1) == undefined ||
			String(serverDescription1) == null ||
			String(nameResponse1) == ''
		)
			serverDescription1 = String(serverDescription);
		if (!String(serverImg1) || String(serverImg1) == undefined || String(serverImg1) == null || String(nameResponse1) == '')
			serverImg1 = String(serverImg);
		else {
			function isValidURL(string) {
				var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
				return res !== null;
			}
			if (!isValidURL(serverImg1))
				return interaction.editReply({
					ephemeral: true,
					content: 'Image has to be a URL.'
				});
		}
		if (!String(serverInvite1) || String(serverInvite1) == undefined || String(serverInvite1) == null || String(nameResponse1) == '')
			serverInvite1 = String(serverInv);
		else {
			let regexDiscord = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[a-z]/g;
			if (!regexDiscord.test(serverInvite1))
				return interaction.editReply({
					ephemeral: true,
					content: 'Invite has to be a Discord domain.'
				});
		}
		if (!String(WhatType1) || String(WhatType1) == undefined || String(WhatType1) == null || String(nameResponse1) == '')
			WhatType1 = String(whatType);
		else {
			// if (WhatType1.toLowerCase() !== "public" && WhatType1.toLowerCase() !== "whitelist" && WhatType1.toLowerCase() !== "allowlist" && WhatType1.toLowerCase() !== "hosting" && WhatType1.toLowerCase() !== "shop" && WhatType1.toLowerCase() !== "fun") return interaction.editReply({
			//     ephemeral: true,
			//     content: "Category must be one of the following: Public/Allowlist/Whitelist/Fun/Hosting/Shop."
			// })
		}

		let button1 = new Discord.ButtonBuilder().setCustomId(`staff_option`).setStyle(Discord.ButtonStyle.Primary).setLabel('Staff Options');
		let button2 = new Discord.ButtonBuilder().setCustomId(`accept`).setStyle(Discord.ButtonStyle.Success).setLabel('Accept');
		let button3 = new Discord.ButtonBuilder().setCustomId(`decline`).setStyle(Discord.ButtonStyle.Danger).setLabel('Decline');
		let button4 = new Discord.ButtonBuilder().setCustomId(`editform`).setStyle(Discord.ButtonStyle.Primary).setLabel('Edit Form');
		const row = new Discord.ActionRowBuilder().addComponents([button1, button2, button3, button4]);

		const ID = Math.floor(Math.random() * 90000) + 10000;
		const transcript_channel = config.logChannel;
		const log = guild.channels.cache.get(transcript_channel);

		const channel1 = await interaction.guild.channels.create({
			name: `${interaction.user.username}-עריכת-שרת`,
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

		const SRole = interaction.guild.roles.cache.find((x) => x.id == config.staffRole);
		// long error , something with footer
		const embed2 = new Discord.EmbedBuilder()
			.setColor(config.embed_color)
			.setTitle(`${channel1.name}`)
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
		const message = await channel1.send({
			components: [row],
			embeds: [embed2],
			content: `<@${interaction.user.id}> ${SRole}`
		});
		await interaction
			.editReply({
				content: `${channel1}`,
				ephemeral: true
			})
			.then(async () => {
				const server = await client.db.getServer(interaction.channelId);

				await db.set(`guild:${guild.id}:user:${interaction.user.id}_ticket`, {
					guildID: interaction.guild.id,
					channelID: interaction.channel.id,
					ownerID: server.ownerID,
					moderator_id: interaction.user.id,
					category: WhatType1,
					votes: server.votes,
					name: nameResponse1,
					description: serverDescription1,
					image: serverImg1,
					invite: serverInvite1,
					messageId: server.messageId
				});

				await db.set(`guild:${guild.id}:channel:${channel1.id}`, interaction.user.id);
			});
	}

	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	parse(interaction) {
		if (interaction.customId !== 'editservermodal') return this.none();

		return this.some();
	}
}

module.exports = {
	ModalHandler
};
