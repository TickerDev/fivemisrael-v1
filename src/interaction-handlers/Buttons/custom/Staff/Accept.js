const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const config = require('../../../../config');
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
const quick = require('quick.db');
const tdb = new quick.QuickDB({ table: 'tickets' });
const client = require('../../../../index.js');
class TicketAddButtonHandler extends InteractionHandler {
	constructor(ctx, options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	parse(interaction) {
		if (interaction.customId !== 'accept') return this.none();

		return this.some();
	}
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	async run(interaction) {
		const { guild } = interaction;

		if (!interaction.member.roles.cache.has(config.staffRole))
			return interaction.reply({
				ephemeral: true,
				content: 'אין לך גישה לזה!'
			});

		if (interaction.channel.parentId == config.tickets.addServers) {

			if (String(interaction.channel.name).includes('עריכת-שרת')) {
				await interaction.deferReply()
				const ownerId = await tdb.get(`guild:${interaction.guild.id}:channel:${interaction.channel.id}`);

				const ticket = await tdb.get(`guild:${interaction.guild.id}:user:${ownerId}_ticket`);
				const ticketServer = await client.db.getServer(ticket.channelID);
				const serverchannel = String(ticket.channelID);
				const servername = String(ticket.name);
				const servermsg = String(ticket.messageId);
				const serverdescription = String(ticket.description);
				const serverimg = String(ticket.image);
				const serverinvite = String(ticket.invite);
				const serverwhattype = String(ticket.category).toLowerCase().trim();
				const serverowner = String(ownerId);
				const guild = interaction.guild;
				const channel1 = guild.channels.cache.get(serverchannel);
				if (!channel1) return interaction.reply("Oh no! seems like I cannot trace the server's channel, does it exist?");
				const votes = ticketServer.votes;

				const message1 = await channel1.messages.fetch(servermsg);
				if (!message1 || message1 == undefined || message1 == null) {
					return
				}
				const member = interaction.guild.members.cache.find((x) => x.id == ownerId);
				if (member.permissions.bitfield < interaction.guild.members.me.permissions.bitfield)
					await member.setNickname(`${servername} | ${member.user.displayName}`).catch((err) => []);

				const channelCategory = config.categories.find((x) => x.parentId == channel1.parentId);
				const serverCategory = config.categories.find((x) => x.type == String(serverwhattype).toLowerCase());

				if (channelCategory.type !== serverwhattype) {
					channel1.setParent(serverCategory.parentId);
					channel1.permissionOverwrites.create(interaction.guild.roles.everyone, {
						ViewChannel: false,
						SendMessages: false
					});
					channel1.permissionOverwrites.create(config.memberRole, {
						ViewChannel: true,
						SendMessages: false
					});
				}


				const embed = new Discord.EmbedBuilder()
					.setTitle(String(servername))
					.setDescription(`${String(serverdescription)}`)
					.setColor(config.embed_color)
					.addFields(
						{
							name: '<:people:1221112270768312320> Server Owner',
							value: `<@${String(serverowner)}>`,
							inline: true
						},
						{
							name: '<:checkmark:1221112246353006612> Votes',
							value: String(votes),
							inline: true
						}
					)
					.setThumbnail(String(serverimg))
					.setFooter({
						text: 'FiveM Israel ©️ 2021-2024',
						iconURL: interaction.guild.members.me.displayAvatarURL()
					})
					.setTimestamp();
				const VoteButton = new Discord.ButtonBuilder()
					.setLabel('Vote Server')
					.setCustomId('voteforserver')
					.setEmoji("<:checkmark:1221112246353006612>")
					.setStyle(Discord.ButtonStyle.Primary);
				const ServerOwnerOptiopns = new Discord.ButtonBuilder()
					.setLabel('Owner Options')
					.setCustomId('owneroptions')
					.setEmoji("<:blurple_crown:1221114322051141713>")
					.setStyle(Discord.ButtonStyle.Primary);
				const join = new Discord.ButtonBuilder().setLabel('Join Here').setStyle(Discord.ButtonStyle.Link).setURL(`${String(serverinvite)}`)
				const row = new Discord.ActionRowBuilder().addComponents([join, VoteButton, ServerOwnerOptiopns]);
				const SuccessEmbed = new Discord.EmbedBuilder()
					.setColor('Green')
					.setDescription(`הבקשה שלך אושרה על ידי <@${interaction.user.id}>, כל השינויים נשמרו ב <#${channel1.id}>`);

				interaction.editReply({
					embeds: [SuccessEmbed]
				});
				const message = await message1.edit({
					embeds: [embed],
					components: [row],
					content: ' '
				});

				await client.db.deleteServer(channel1.id);

				const data = await client.db.createServer({
					guildID: interaction.guild.id,
					channelID: channel1.id,
					ownerID: ownerId,
					moderatorID: interaction.user.id,
					category: serverwhattype.toLowerCase().trim(),
					votes: votes,
					name: servername,
					description: serverdescription,
					image: serverimg,
					invite: serverinvite,
					messageId: message.id
				});
				const newChannel = guild.channels.cache.find((x) => x.id == channel1.id);
				await channel1.setName(`${newChannel.position + 1}. ${servername}`);

				if (!data || !data[0]) return await interaction.reply('Something went wrong, please try again later.');

				return;
			}
			if (interaction.channel.name.includes('מחיקה')) {
				const { channel, guild } = interaction;

				const ownerId = await tdb.get(`guild:${interaction.guild.id}:channel:${interaction.channelId}`);
				const ticket = await tdb.get(`guild:${guild.id}:user:${ownerId}_ticket`);
				const ticketServer = await client.db.getServer(ticket.serverChannel);
				if (!ticketServer || ticketServer == undefined || ticketServer == null) return interaction.reply('No server found');

				const channel1 = interaction.guild.channels.cache.find((x) => x.id == String(ticketServer.channel_id));
				if (channel1 == null || channel1 == undefined)
					return interaction.reply({
						content: "Couldn't find server room."
					});
				const member = interaction.guild.members.cache.find((x) => x.id == ticket.serverOwner);
				try {
					if (interaction.member.permissions.bitfield < interaction.guild.members.me.permissions.bitfield)
						await member.setNickname(`${member.user.username}`);
				} catch (error) {
					interaction.reply({
						content: "couldn't change owner's name"
					});
				}

				if (member.roles.cache.has(config.OwnerRole)) member.roles.remove(config.OwnerRole);

				const { categories } = config;
				await client.db.deleteServer(channel1.id);
				channel1.delete();

				const SuccessEmbed = new Discord.EmbedBuilder()
					.setColor('Green')
					.setDescription(`הבקשה שלך אושרה על ידי <@${interaction.user.id}> והחדר נמחק.`);
				return interaction.reply({
					embeds: [SuccessEmbed]
				});
			}

			if (interaction.channel.name.includes('הוספת')) {
				const ownerId = await tdb.get(`guild:${interaction.guild.id}:channel:${interaction.channel.id}`);
				const ticket = await tdb.get(`guild:875892539062910977:user:${String(ownerId)}_ticket`);
				const member = interaction.guild.members.cache.get(ownerId);
				const options = {
					type: 'GUILD_TEXT'
				};
				if (String(ticket.name).length >= 25)
					return interaction.reply({
						content: 'Server name cannot be more than 25 characters'
					});
				try {
					if (interaction.member.permissions.bitfield < interaction.guild.members.me.permissions.bitfield)

						member.setNickname(`${String(ticket.name)} | ${member.user.displayName}`);
				} catch (error) {
					console.error(error);
				}
				if (!member.roles.cache.has(config.OwnerRole)) {
					await member.roles.add(config.OwnerRole);
				}
				let category;
				if (String(ticket.category).toLowerCase().trim() == 'public') category = config.categories[2].parentId;
				else if (String(ticket.category).toLowerCase().trim() == 'whitelist') category = config.categories[0].parentId;
				else if (String(ticket.category).toLowerCase().trim() == 'allowlist') category = config.categories[1].parentId;
				else if (String(ticket.category).toLowerCase().trim() == 'fun') category = config.categories[3].parentId;
				else if (String(ticket.category).toLowerCase().trim() == 'shop') category = config.categories[5].parentId;
				else if (String(ticket.category).toLowerCase().trim() == 'hosting') category = config.categories[4].parentId;
				else return interaction.reply('could not find category!');

				const channel = await interaction.guild.channels.create({
					name: `${ticket.name}`,
					reason: 'opening a server room',
					parent: category
				});

				await channel.setName(`${channel.position + 1}. ${ticket.name}`);

				channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
					ViewChannel: false,
					SendMessages: false
				});
				channel.permissionOverwrites.edit(config.memberRole, {
					ViewChannel: true,
					SendMessages: false
				});
				// const embedInfo = new Discord.EmbedBuilder()
				// 	.setTitle(String(servername))
				// 	.setDescription(`${String(serverdescription)}`)
				// 	.setColor(config.embed_color)
				// 	.addFields(
				// 		{
				// 			name: '<:people:1221112270768312320> Server Owner',
				// 			value: `<@${String(serverowner)}>`
				// 		},
				// 		{
				// 			name: '<:checkmark:1221112246353006612> Votes',
				// 			value: String(votes)
				// 		}
				// 	)
				// 	.setThumbnail(String(serverimg))
				// 	.setFooter({
				// 		text: 'FiveM Israel ©️ 2021-2024',
				// 		iconURL: interaction.guild.members.me.displayAvatarURL()
				// 	})
				// 	.setTimestamp();
				// const VoteButton = new Discord.ButtonBuilder()
				// 	.setLabel('Vote Server')
				// 	.setCustomId('voteforserver')
				// 	.setStyle(Discord.ButtonStyle.Primary);
				// const ServerOwnerOptiopns = new Discord.ButtonBuilder()
				// 	.setLabel('Owner Options')
				// 	.setCustomId('owneroptions')
				// 	.setStyle(Discord.ButtonStyle.Primary);
				// const join = new Discord.ButtonBuilder().setLabel('Join Here').setStyle(Discord.ButtonStyle.Link).setURL(`${String(serverinvite)}`)
				// const row = new Discord.ActionRowBuilder().addComponents([join, VoteButton, ServerOwnerOptiopns]);

				const embedInfo = new Discord.EmbedBuilder()
					.setTitle(ticket.name)
					.setDescription(`${ticket.description}`)
					.addFields(
						{
							name: '<:people:1221112270768312320> Server Owner',
							value: `<@${String(member.id)}>`,
							inline: true
						},
						{
							name: '<:checkmark:1221112246353006612> Votes',
							value: "0",
							inline: true
						}
					)
					.setThumbnail(String(ticket.image))
					.setFooter({
						text: 'Fivem Israel ©️ 2021-2024',
						iconURL: interaction.guild.members.me.displayAvatarURL()
					})
					.setTimestamp()
					.setColor(config.embed_color);

				const VoteButton = new Discord.ButtonBuilder()
					.setLabel('Vote Server')
					.setCustomId('voteforserver')
					.setStyle(Discord.ButtonStyle.Primary).setEmoji("<:checkmark:1221112246353006612>");
				const ServerOwnerOptiopns = new Discord.ButtonBuilder()
					.setLabel('Owner Options')
					.setCustomId('owneroptions')
					.setStyle(Discord.ButtonStyle.Primary).setEmoji("<:blurple_crown:1221114322051141713>");
				const join = new Discord.ButtonBuilder().setLabel('Join Here').setStyle(Discord.ButtonStyle.Link).setURL(`${String(ticket.invite)}`)
				const row = new Discord.ActionRowBuilder().addComponents([join, VoteButton, ServerOwnerOptiopns]);
				const SuccessEmbed = new Discord.EmbedBuilder()
					.setColor('Green')
					.setDescription(
						`השרת נוסף בהצלחה לרשימה! ⭐
                            
                         דבר אחרון שנשאר הוא לפרסם את השרת שלנו בעדכונים אצלך,
                         גם על מנת לעזור לנו לגדול, וגם על מנת שתהיה מקום גבוה יותר ברשימה,
                         עזור לנו לאסוף את כל הקהילה הישראלית אלינו ולכוון אותה לעתיד טוב יותר בפייבאם ישראל. ❤️
                         
                         
                         ההודעה אשר תפרסם - 🌄
                         אני מזמין אתכם לשרת הפייבאם ישראל הארצי.
                         השרת מכיל רשימת שרתים ובין הרשימה נמצא השרת שלנו
                         ככל שנעלה ברשימה ככה השרת שלנו ישתפר, השרת מכיל הגרלות, טיפים ומגוון דברים שיעזרו לכל שחקן או מנהל שרת.
                         קישור תמידי לשרת : https://discord.gg/BhAkSuZ3n6
						 ---------------------------------------------------------------------------------
						 **עכשיו רק נשאר לך לשלוח פה תמונה שפרסמת בשרת שלך שנדע שאתה רשמית איתנו 🙂**
						 ---------------------------------------------------------------------------------
                         \n`
					)
					.setFooter({ text: `אושר על ידי ${interaction.user.displayName}` });

				interaction.channel.send({
					embeds: [SuccessEmbed],
					content: `<#${channel.id}>, <@${member.id}>`
				});
				const logChannel = guild.channels.cache.find((x) => x.id == config.logChannel);
				logChannel.send({
					embeds: [
						new Discord.EmbedBuilder()
							.setTitle('New Server Created')
							.setDescription(`Server: ${ticket.name} got created by - ${interaction.user.username}`)
							.setColor(config.embed_color)
					]
				});
				const message = await channel.send({
					embeds: [embedInfo],
					components: [row]
				});

				const data = await client.db.createServer({
					category: String(ticket.category).toLowerCase().trim(),
					channelID: channel.id,
					guildID: interaction.guild.id,
					ownerID: member.id,
					moderatorID: interaction.user.id,
					votes: 0,
					name: ticket.name,
					description: ticket.description,
					image: ticket.image,
					invite: ticket.invite,
					messageId: message.id
				});

				if (!data || !data[0]) return;

				return;

				try {
					if (interaction.member.permissions.bitfield < interaction.guild.members.me.permissions.bitfield) await member.setNickname(`${ticket.name} | ${member.user.displayName}`);
					await member.roles.add(config.OwnerRole);
					const options = {
						type: 'GUILD_TEXT'
					};

					let category;

					if (String(ticket.category).toLowerCase().trim() == 'public') category = config.categories[2].parentId;
					else if (String(ticket.category).toLowerCase().trim() == 'whitelist') category = config.categories[0].parentId;
					else if (String(ticket.category).toLowerCase().trim() == 'allowlist') category = config.categories[1].parentId;
					else if (String(ticket.category).toLowerCase().trim() == 'fun') category = config.categories[3].parentId;
					else if (String(ticket.category).toLowerCase().trim() == 'shop') category = config.categories[5].parentId;
					else if (String(ticket.category).toLowerCase().trim() == 'hosting') category = config.categories[4].parentId;
					else return interaction.reply('could not find category!');
					const channel = await interaction.guild.channels.create({
						name: `${ticket.name}`,
						reason: 'opening a server room',
						parent: category
					});

					await channel.setName(`${channel.position + 1}. ${ticket.name}`);
					channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
						ViewChannel: false,
						SendMessages: false
					});
					channel.permissionOverwrites.create(config.memberRole, {
						ViewChannel: true,
						SendMessages: false
					});
					const embed = new Discord.EmbedBuilder()
						.setTitle(ticket.name)
						.setDescription(`${ticket.description}`)
						.addFields(
							{
								name: 'Discord Link',
								value: `[Click Here](${String(ticket.invite)})`
							},
							{
								name: 'Server Owner',
								value: `<@${String(member.id)}>`
							},
							{
								name: 'Votes',
								value: '0'
							}
						)
						.setThumbnail(String(ticket.image))
						.setFooter({
							text: 'Fivem Israel ©️ 2021-2024',
							iconURL: interaction.guild.members.me.displayAvatarURL()
						})
						.setTimestamp()
						.setColor(config.embed_color);
					const VoteButton = new Discord.ButtonBuilder().setLabel('Vote Server').setCustomId('voteforserver').setStyle(Discord.ButtonStyle.Primary);
					const ServerOwnerOptiopns = new Discord.ButtonBuilder().setLabel('Owner Options').setCustomId('owneroptions').setStyle(Discord.ButtonStyle.Primary);
					const row = new Discord.ActionRowBuilder().addComponents([VoteButton, ServerOwnerOptiopns]);

					const SuccessEmbed = new Discord.EmbedBuilder()
						.setColor('Green')
						.setDescription(
							`השרת נוסף בהצלחה לרשימה! ⭐
                            
                    דבר אחרון שנשאר הוא לפרסם את השרת שלנו בעדכונים אצלך,
                    גם על מנת לעזור לנו לגדול, וגם על מנת שתהיה מקום גבוה יותר ברשימה,
                    עזור לנו לאסוף את כל הקהילה הישראלית אלינו ולכוון אותה לעתיד טוב יותר בפייבאם ישראל. ❤️
                    
                    
                    ההודעה אשר תפרסם - 🌄
                    אני מזמין אתכם לשרת הפייבאם ישראל הארצי.
                    השרת מכיל רשימת שרתים ובין הרשימה נמצא השרת שלנו
                    ככל שנעלה ברשימה ככה השרת שלנו ישתפר, השרת מכיל הגרלות, טיפים ומגוון דברים שיעזרו לכל שחקן או מנהל שרת.
                    קישור תמידי לשרת : https://discord.gg/BhAkSuZ3n6
                    ---------------------------------------------------------------------------------
                    **עכשיו רק נשאר לך לשלוח פה תמונה שפרסמת בשרת שלך שנדע שאתה רשמית איתנו 🙂**
                    --------------------------------------------------------------------------------`
						)
						.setFooter({ text: `אושר על ידי ${interaction.user.displayName}` });

					interaction.channel.send({
						embeds: [SuccessEmbed],
						content: `<#${channel.id}>, <@${member.id}>`
					});
					const logChannel = guild.channels.cache.find((x) => x.id == config.logChannel);
					logChannel.send({
						embeds: [
							new Discord.EmbedBuilder()
								.setTitle('New Server Created')
								.setDescription(`Server: ${ticket.name} got created by - ${interaction.user.username}`)
								.setColor(config.embed_color)
						]
					});
					const message = await channel.send({
						embeds: [embed],
						components: [row]
					});

					const data = await client.db.createServer({
						category: String(ticket.category).toLowerCase().trim(),
						channelID: channel.id,
						guildID: interaction.guild.id,
						ownerID: member.id,
						moderatorID: interaction.user.id,
						votes: 0,
						name: ticket.name,
						description: ticket.description,
						image: ticket.image,
						invite: ticket.invite,
						messageId: message.id
					});
				} catch (e) {
					console.error(e);
					return interaction.reply('Something went wrong when running this command!');
				}
			}
		}
		if (interaction.channel.parentId == config.tickets.blacklist) {
			const ownerId = await tdb.get(`guild:${interaction.guild.id}:channel:${interaction.channel.id}`);
			const ticket = await tdb.get(`guild:${guild.id}:user:${ownerId}_ticket`);

			if (ticket.evidence2 == null || !ticket.evidence2 || ticket.evidence2 == undefined) {
				const user = interaction.guild.members.cache.get(String(ticket.blacklistId));
				if (!user || user == null || user == undefined) {
					const embed = new Discord.EmbedBuilder().setTitle('בלאקליסט חדש!').addFields([
						{
							name: 'מקבל הבלאקליסט:',
							value: `${ticket.name}`
						},
						{
							name: 'איידי של מקבל הבלאקליסט:',
							value: ticket.blacklistId
						},
						{
							name: 'סיבה לטענת מגיש הבלאק ליסט:',
							value: ticket.reason
						},
						{
							name: 'הוכחה/ות:',
							value: `[לחצו פה](${String(ticket.evidence)})`
						}
					]);

					const channel = interaction.guild.channels.cache.get(config.BlackListChannel);
					channel.send({
						embeds: [embed]
					});
					const SuccessEmbed = new Discord.EmbedBuilder()
						.setColor('Green')
						.setDescription(
							`Your blacklist was approved by <@${interaction.user.id}>, and has been sent in <#${config.BlackListChannel}>`
						);
					interaction.reply({
						embeds: [SuccessEmbed]
					});

					return;
				}
				const embed = new Discord.EmbedBuilder().setTitle('!בלאקליסט חדש').addFields([
					{
						name: 'מקבל הבלאקליסט:',
						value: `${ticket.name}`
					},
					{
						name: 'איידי של מקבל הבלאקליסט:',
						value: `<@${ticket.blacklistId}>`
					},
					{
						name: 'סיבה לטענת מגיש הבלאק ליסט:',
						value: ticket.reason
					},
					{
						name: 'הוכחה/ות:',
						value: `[לחצו פה](${String(ticket.evidence)})`
					}
				]);
				await user.roles.add(config.BlackListRole);

				const channel = interaction.guild.channels.cache.get(config.BlackListChannel);
				channel.send({
					embeds: [embed]
				});
				const SuccessEmbed = new Discord.EmbedBuilder()
					.setColor('Green')
					.setDescription(`Your blacklist was approved by <@${interaction.user.id}>, and has been sent in <#${config.BlackListChannel}>`);
				interaction.reply({
					embeds: [SuccessEmbed]
				});

				return;
			}

			const user = interaction.guild.members.cache.get(String(ticket.blacklistId));

			if (!user || user == null || user == undefined) {
				const embed = new Discord.EmbedBuilder().setTitle('!בלאקליסט חדש').addFields([
					{
						name: 'מקבל הבלאקליסט:',
						value: `${ticket.name}`
					},
					{
						name: 'איידי של מקבל הבלאקליסט:',
						value: ticket.blacklistId
					},
					{
						name: 'סיבה לטענת מגיש הבלאק ליסט:',
						value: ticket.reason
					},
					{
						name: 'הוכחה/ות:',
						value: `[לחצו פה](${String(ticket.evidence)}), [לחצו פה](${String(ticket.evidence2)}) `
					}
				]);
				const channel = interaction.guild.channels.cache.get(config.BlackListChannel);
				channel.send({
					embeds: [embed]
				});
				const SuccessEmbed = new Discord.EmbedBuilder()
					.setColor('Green')
					.setDescription(`Your blacklist was approved by <@${interaction.user.id}>, and has been sent in <#${config.BlackListChannel}>`);
				interaction.reply({
					embeds: [SuccessEmbed]
				});

				return;
			}
			const embed = new Discord.EmbedBuilder().setTitle('!בלאקליסט חדש').addFields([
				{
					name: 'מקבל הבלאקליסט:',
					value: `${ticket.name}`
				},
				{
					name: 'איידי של מקבל הבלאקליסט:',
					value: `<@${ticket.blacklistId}>`
				},
				{
					name: 'סיבה לטענת מגיש הבלאק ליסט:',
					value: ticket.reason
				},
				{
					name: 'הוכחה/ות:',
					value: `[לחצו פה](${String(ticket.evidence)}), [לחצו פה](${String(ticket.evidence2)}) `
				}
			]);
			await user.roles.add(config.BlackListRole);
			const channel = interaction.guild.channels.cache.get(config.BlackListChannel);
			channel.send({
				embeds: [embed]
			});
			const SuccessEmbed = new Discord.EmbedBuilder()
				.setColor('Green')
				.setDescription(`Your blacklist was approved by <@${interaction.user.id}>, and has been sent in <#${config.BlackListChannel}>`);
			interaction.reply({
				embeds: [SuccessEmbed]
			});
		}
	}
}
module.exports = {
	TicketAddButtonHandler
};
