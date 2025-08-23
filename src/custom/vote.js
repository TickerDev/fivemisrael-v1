const { EmbedBuilder, WebhookClient, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const quickDB = require('quick.db');
const webhooks = new quickDB.QuickDB({ table: 'webhooks' });
const serverVotesDb = new quickDB.QuickDB({ table: 'servervotes' });

const cooldowns = new quickDB.QuickDB({ table: 'cooldowns' });
const config = require('../config');
const humanizeDuration = require('humanize-duration');
function humanize(ms) {
	return humanizeDuration(ms, {
		round: true,
		conjunction: ' ו ',
		serialComma: false,
		language: 'he'
	});
}
async function sendVoteToWsServer(voteData) {
	try {
		if (!config.websocketserver) return;
		const response = await fetch(`${config.websocketserver}/api/votes`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(voteData)
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Failed to send vote to WS server: ${response.status} - ${errorText}`);
		}
	} catch (error) {
		console.error('Error sending vote to WS server:', error);
	}
}
async function vote(client, interaction) {
	const { user, message, channel } = interaction;
	if (!message) return;
	if (user.bot) return;

	const server = await client.db.getServer(channel.id);
	if (!server)
		return await interaction.reply({
			ephemeral: true,
			content: 'השרת לא רשום, פנה לצוות.'
		});
	const cooldown = await cooldowns.get(`${channel.id}.${user.id}`);
	const memberIsBooster = interaction.member.premiumSince;
	// Ugly Code
	const cooldownTime = memberIsBooster ? Number(60 * 60 * 12 * 1000) : Number(60 * 60 * 24 * 1000);
	if (user.id !== "470957190069616647" && (cooldown !== null && cooldownTime - (Date.now() - cooldown) > 0)) {
		const timeLeft = cooldown !== null ? cooldownTime - (Date.now() - Number(cooldown)) : 0;
		return await interaction.reply({
			ephemeral: true,
			content: `אתה צריך להמתין **${humanize(timeLeft)}** לפני שתוכל להצביע שוב`
		});
	} else await cooldowns.set(`${channel.id}.${user.id}`, Date.now());
	let amount = 1;
	if (interaction.member.roles.cache.has(config.boosterRole)) amount += 1;
	let newAmount = server.votes + amount;
	await client.db.addServerVote({
		channelID: channel.id,
		number: amount
	});
	await sendVoteToWsServer({
		channelId: channel.id,
		user_id: user.id,
		username: user.tag,
		amount: amount,
		timestamp: new Date().toISOString()
	});
	const embed = new EmbedBuilder(message.embeds[0]);
	embed.setColor(config.embed_color);
	const votesField = embed.data.fields.find((field) => field.name?.toLowerCase().includes('votes'));
	if (votesField) {
		if (embed.data.fields.filter((field) => field.name?.toLowerCase().includes('votes')).length > 1) {
			embed.data.fields = embed.data.fields.filter((field) => !field.name?.toLowerCase().includes('votes'));

			embed.addField('Votes', server ? Number.parseInt(newAmount).toString() : '1');
		} else votesField.value = Number.parseInt(newAmount).toString();
	} else embed.addField('Votes', server ? Number.parseInt(newAmount).toString() : '1');

	setTimeout(async () => await message.edit({ embeds: [embed] }), 500);
	var timestampUTC = Date.now();
	var date = new Date(timestampUTC);
	var israelOffset = date.getTimezoneOffset();
	var isDST = israelOffset === -120;


	var israelOffsetMillis = (isDST ? 3 : 2) * 60 * 60 * 1000;
	var timestampIsrael = timestampUTC + israelOffsetMillis;

	if (!await serverVotesDb.get(channel.id)) {
		await serverVotesDb.set(channel.id, [{
			user: interaction.user.id,
			amount: amount,
			date: new Date(timestampIsrael)
		}])
	} else {
		await serverVotesDb.push(channel.id, {
			user: interaction.user.id,
			amount: amount,
			date: new Date(timestampIsrael)
		})
	}
	const channelVoteLog = interaction.guild.channels.cache.get(config.list.voteLogs);
	const embedVoteLog = new EmbedBuilder()
		.setColor(config.embed_color)
		.setDescription(
			`**\`${user.tag}\` just voted for <#${server.channel_id}>, The server now has \`${newAmount}\`**`
		);
	if (channelVoteLog) await channelVoteLog.send({ embeds: [embedVoteLog] });
	const webhook = await webhooks.get(interaction.channelId);
	if (webhook) {
		try {
			const webhookClient = new WebhookClient({ url: webhook });
			await webhookClient.send({
				embeds: [
					new EmbedBuilder()
						.setFooter({ text: 'הצבעה מפייבאם ישראל', iconURL: interaction.guild.members.me.displayAvatarURL() })
						.setTitle('הצבעה חדשה!')
						.setDescription(
							`תודה רבה ל ${interaction.user} (\`${interaction.user.displayName}\`) על ההצבעה!<a:sparkles:1203730475449843722>\nבזכותו אנחנו יושבים על **${newAmount} הצבעות!**\nהצביעו לנו גם בפייבאם ישראל!`
						)
						.setColor(config.embed_color)
						.setTimestamp()
				],
				avatarURL: interaction.guild.members.me.displayAvatarURL(),
				username: 'פייבאם ישראל - הצבעות'
			});
		} catch (error) {
			console.log("Webhook send failed:", error);
			if (error.code === 10015) {
				await webhooks.delete(interaction.channelId);
			}
		}

	}

	return await interaction.reply({
		ephemeral: true,
		content: `הצבעת בהצלחה ל - ** ${server.name}**`
	});
}

module.exports.vote = vote;