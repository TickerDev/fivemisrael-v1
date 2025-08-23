const Discord = require('discord.js');
require('dotenv').config();
const config = require('../config');
const { categories } = config;
const humanizeDuration = require('humanize-duration');

class ClientUtil {
	constructor(client) {
		this.client = client;
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


	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	generateKey(length) {
		const upcase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const lowcase = 'abcdefghijklmnopqrstuvwxyz';
		const numbers = '0123456789';
		const symbols = '!@#$%^&*()_+-=[]{}|;:,./<>?';
		const characters = upcase + lowcase + numbers + symbols;

		let key = '';
		for (var i = 0; i < length; i++) {
			key += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return key;
	}

	getMember(guild, args) {
		let member = null;
		if (!args || typeof args !== 'string') return;
		if (args.match(/^<@!?(\d+)>$/)) {
			const memberID = args.match(/^<@!?(\d+)>$/)[1];
			member = guild.members.cache.get(memberID);
			if (member) return member;
		}

		member = guild.members.cache.get(args);
		return member;
	}

	getChannel(guild, args) {
		let channel = null;
		if (!args || typeof args !== 'string') return;
		if (args.match(/^<#?(\d+)>$/)) {
			const channelID = args.match(/^<#?(\d+)>$/)[1];
			channel = guild.channels.cache.get(channelID);
			if (channel) return channel;
		}

		channel = guild.channels.cache.find((ch) => ch.name.toLowerCase() == args.toLowerCase());
		if (channel) return channel;
		channel = guild.channels.cache.get(args);

		return channel;
	}

	async sortChannels(guild, categoryID) {
		if (categoryID) {
			const category = categories.find((c) => c.type == categoryID);
			if (!category) return;

			const allServers = await this.client.db.getAllServers({
				category: categoryID,
				sort: true
			});

			if (allServers && allServers.length > 0) {
				let failed = [];
				let succeed = [];
				const channels = guild.channels.cache
					.filter((channel) => channel.type == Discord.ChannelType.GuildText && channel.parentId == category.parentId && channel.position !== 0)
					.toJSON();
				const servers = allServers.filter((s) => this.getChannel(guild, s.channelID)).map((s) => s.channelID);
				for (const channel of channels) {
					const server = await this.client.db.getServer(channel.id);
					if (!server) return;
					const serverPosition = servers.indexOf(channel.id);
					const channelVM = server.votes;
					var p = 0;
					const channelAbove = guild.channels.cache.find((x) => x.parentId == channel.parentId && x.position == channel.position - 1);

					const server2 = await this.client.db.getServer(channelAbove.id);
					const channelVS = server2.votes;
					if (channelAbove.position < channel.position) {
						if (server2.votes < server.votes) {
							await channel
								.setPosition(channelAbove.position)
								.catch(() =>
									failed.push({
										channel: channel,
										position: serverPosition,
										votes: server.votes
									})
								)
								.then(() =>
									succeed.push({
										channel: channel,
										position: serverPosition,
										votes: server.votes
									})
								);
						}
					}

					const isBoostedServer = server.boosted && new Date(Number(server.boostEndedAt)).getTime() > Date.now();
				}
				return {
					failed: {
						count: failed.length,
						channels: failed
					},
					succeed: {
						count: succeed.length,
						channels: succeed
					}
				};
			}
		} else {
			for (const category of categories) {
				const allServers =
					(await this.client.db.getAllServers({
						category: category.type,
						sort: true
					})) || [];
				if (allServers && allServers.length > 0) {
					let failed = [];
					let succeed = [];

					const channels = guild.channels.cache
						.filter((channel) => channel.type == 'GUILD_TEXT' && channel.parentId == category.parentId)
						.toJSON();
					const servers = allServers.filter((s) => this.getChannel(guild, s.channelID)).map((s) => s.channelID);
					for (const channel of channels) {
						const server = await this.client.db.getServer(channel.id);
						if (!server) return;

						const serverPosition = servers.indexOf(channel.id);
						const channelVM = server.votes;
						var p = 0;
						for (const channel of channels) {
							const server2 = await this.client.db.getServer(channel.id);
							const channelVS = server2.votes;
							if (channelVS > channelVM) p++;
						}
						if (serverPosition != p) await channel.setPosition(p);
					}

					return {
						failed: {
							count: failed.length,
							channels: failed
						},
						succeed: {
							count: succeed.length,
							channels: succeed
						}
					};
				}
			}
		}
	}
}
module.exports = ClientUtil;
