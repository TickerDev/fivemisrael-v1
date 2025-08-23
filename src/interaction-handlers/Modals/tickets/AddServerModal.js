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
		await interaction.deferReply({ ephemeral: true })
		const { guild } = interaction;
		if (await db.get(`guild:${guild.id}:user:${interaction.user.id}_ticket`)) {
			const ticket = await db.get(`guild:${guild.id}:user:${interaction.user.id}_ticket`);
			const channel = guild.channels.cache.get(ticket.channelID);
			if (!channel) await db.delete(`guild:${guild.id}:user:${interaction.user.id}_ticket`);
			else
				return interaction.editReply({

					content: `**היי יו אחי!**, מה זה אמור להיות? **יש לך טיקט פתוח!** חזור אליו פה <#${channel.id}> *(אם אתה לא רואה את הטיקט פנה לצוות)*`
				});
		}
		const options = {
			type: 'GUILD_TEXT'
		};
		let button1 = new Discord.ButtonBuilder().setCustomId(`staff_option`).setStyle(Discord.ButtonStyle.Primary).setLabel('Staff Options');
		let button2 = new Discord.ButtonBuilder().setCustomId(`accept`).setStyle(Discord.ButtonStyle.Success).setLabel('Accept');
		let button3 = new Discord.ButtonBuilder().setCustomId(`decline`).setStyle(Discord.ButtonStyle.Danger).setLabel('Decline');
		let button4 = new Discord.ButtonBuilder().setCustomId(`editform`).setStyle(Discord.ButtonStyle.Primary).setLabel('Edit Form');
		const row = new Discord.ActionRowBuilder().addComponents([button1, button2, button3, button4]);

		const ID = Math.floor(Math.random() * 90000) + 10000;
		const transcript_channel = config.LogChannelID;
		const log = guild.channels.cache.get(transcript_channel);
		const serverDescription = interaction.fields.getTextInputValue('serverdescriptionquestion');
		const serverImg = interaction.fields.getTextInputValue('serverimg');
		const serverInvite = interaction.fields.getTextInputValue('serverinvite');
		const nameResponse = interaction.fields.getTextInputValue('namequestion');
		const WhatType = interaction.fields.getTextInputValue('whattype');
		if (
			nameResponse.toLowerCase().includes('roleplay') ||
			nameResponse.toLowerCase().includes('dm') ||
			nameResponse.toLowerCase().includes('shop')
		)
			return interaction.editReply({

				content: 'Name must not include the title of the server (including Rolplay, DM, Hosting etc.)'
			});

		function isValidURL(string) {
			var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
			return res !== null;
		}
		if (!isValidURL(serverImg))
			return interaction.editReply({

				content: 'Image has to be a URL.'
			});
		let regexDiscord = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;
		if (!isValidURL(serverInvite))
			return interaction.editReply({

				content: 'Invite has to be a Discord URL.'
			});

		if (!regexDiscord.test(serverInvite))
			return interaction.editReply({

				content: 'Invite has to be a Discord domain.'
			});
		// if (WhatType.toLowerCase() !== "public" && WhatType.toLowerCase() !== "whitelist" && WhatType.toLowerCase() !== "allowlist" && WhatType.toLowerCase() !== "hosting" && WhatType.toLowerCase() !== "shop" && WhatType.toLowerCase() !== "fun") return interaction.editReply({
		//     
		//     content: "Category must be one of the following: Public/Allowlist/Whitelist/Fun/Hosting/Shop."
		// })

		const channel = await interaction.guild.channels.create({
			name: `${interaction.user.username}-הוספת-שרת`,
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
					id: config.staffRole,
					allow: ['ViewChannel']
				}
			]
		});
		const SRole = interaction.guild.roles.cache.find((x) => x.id == config.staffRole);

		const embed2 = new Discord.EmbedBuilder()
			.setColor(config.embed_color)
			.setTitle(`${channel.name}`)
			.addFields(
				{
					name: 'שם',
					value: nameResponse
				},
				{
					name: 'תיאור השרת',
					value: serverDescription
				},
				{
					name: 'תמונת השרת',
					value: serverImg
				},
				{
					name: 'קישור לשרת',
					value: serverInvite
				},
				{
					name: 'סוג שרת',
					value: String(WhatType).toLowerCase()
				}
			);
		const message = await channel.send({
			components: [row],
			embeds: [embed2],
			content: `<@${interaction.user.id}> ${SRole}`
		});
		await interaction
			.editReply({
				content: `${channel}`,
				ephemeral: true
			})
			.then(async () => {
				const data = await db.set(`guild:${guild.id}:user:${interaction.user.id}_ticket`, {
					channelID: channel.id,
					ownerID: interaction.member.id,
					messageId: message.id,
					name: nameResponse,
					description: serverDescription,
					image: serverImg,
					invite: serverInvite,
					category: String(WhatType).toLowerCase().trim()
				});
				await db.set(`guild:${guild.id}:channel:${channel.id}`, interaction.user.id);
			});
	}
	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	parse(interaction) {
		if (interaction.customId !== 'addserverModal') return this.none();

		return this.some();
	}
}
module.exports = {
	ModalHandler
};
