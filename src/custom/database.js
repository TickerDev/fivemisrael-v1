const quick = require('quick.db');
const db = new quick.QuickDB({ table: 'servers' });

class Database {
	constructor() { }
	async getServers() {
		var servers = (await db.get('servers')) || [];
		if (typeof servers === 'string') servers = JSON.parse(servers);
		return servers;
	}
	async createServer({ category, channelID, guildID, ownerID, moderatorID, votes = 0, name, description, image, invite, messageId }) {
		const result = await db.push('servers', {
			id: this.#getRandomID(),
			guild_id: guildID,
			channel_id: channelID,
			owner_id: ownerID,
			moderator_id: moderatorID,
			category,
			votes,
			name: name,
			description: description,
			image: image,
			invite: invite,
			messageId: messageId,
			boosted: false,
			boost_endAt: null
		});

		return result;
	}

	async deleteServer(id) {
		const servers = await this.getServers();
		const server = servers.find((server) => server.channel_id == id || server.owner_id == id);

		if (!server) return false;
		const index = servers.indexOf(server);
		servers.splice(index, 1);
		return await db.set('servers', servers);
	}

	async getServer(channelID) {
		const servers = (await this.getServers()) || [];

		if (!servers) {
			return null;
		}

		const server = servers.find((s) => s.channel_id == channelID);

		if (!server) {
			return null;
		}

		return {
			id: server.id,
			guild_id: server.guild_id,
			channel_id: server.channel_id,
			owner_id: server.owner_id,
			moderator_id: server.moderator_id,
			category: server.category,
			votes: server.votes,
			name: server.name,
			description: server.description,
			image: server.image,
			invite: server.invite,
			messageId: server.messageId,
			boosted: false,
			boost_endAt: null
		};
	}

	async suspendServer(channelID, reason) {
		const server = JSON.parse(await db.get('servers')).find((s) => s.channel_id == channelID);
		const serverData = {
			id: server ? server.id : null,
			category: server ? server.category : null,
			guildID: server ? server.guild_id : null,
			channelID: server ? server.channel_id : channelID,
			ownerID: server ? server.owner_id : null,
			moderatorID: server ? server.moderator_id : null,
			votes: server ? Number(server.votes) : null,
			boosted: server ? Boolean(server?.boosted) : null,
			boostEndedAt: server ? server.boost_endAt : null,
			created: !!server,
			name: server ? server.name : null,
			description: server ? server.description : null,
			image: server ? server.image : null,
			invite: server ? server.invite : null,
			messageId: server ? server.messageId : null
		};
		await db.set(channelID, server, { table: 'suspended_servers' });
		this.deleteServer(server.channel_id);
		return true;
	}
	async getallInvalidServers() {
		const servers = await this.getServers();
		if (!servers || servers == null) return null;
		const regex = /(?:discord\.gg|discord\.com\/invite)\/([^\/]+)/;
		let invalidServers = [];
		for (const server of servers) {
			const match = server.invite.match(regex);
			if (match && match[1]) {
				const code = match[1];
				try {
					const res = await fetch(`https://discordapp.com/api/invite/${code}`);
					if (!res.ok) {
						throw new Error(`HTTP error! Status: ${res.status}`);
					}
					const contentType = res.headers.get('content-type');
					if (contentType && contentType.includes('application/json')) {
						const json = await res.json();
						if (json.message === 'Unknown Invite') {
							invalidServers.push(server);
						}
					} else {
						// Handle non-JSON response (possibly HTML)
						console.error('Non-JSON response received:', await res.text());
					}
				} catch (error) {
					console.error('Error fetching invite data:', error);
				}
			} else {
				invalidServers.push(server);
			}
		}
		return invalidServers;
	}

	async getServerByUser(user) {
		const server = await this.getServers().find((s) => s.ownerID == user);

		return {
			id: server ? server.id : null,
			category: server ? server.category : null,
			guildID: server ? server.guild_id : null,
			channelID: server ? server.channel_id : null,
			ownerID: server ? server.owner_id : user,
			moderatorID: server ? server.moderator_id : null,
			votes: server ? Number(server.votes) : null,
			boosted: server ? Boolean(server?.boosted) : null,
			boostEndedAt: server ? server.boost_endAt : null,
			created: !!server,
			name: server ? server.name : null,
			description: server ? server.description : null,
			image: server ? server.image : null,
			invite: server ? server.invite : null,
			messageId: server ? server.messageId : null
		};
	}

	async addServerVote({ channelID, number }) {
		const servers = await this.getServers();
		const server = servers.find((s) => s.channel_id == channelID || s.id == channelID);
		if (!server) return false;

		server.votes += Number(number);
		return await db.set('servers', servers);
	}

	async setServerVotes({ channelID, number }) {
		const servers = await this.getServers();
		const server = servers.find((s) => s.channel_id == channelID || s.id == channelID);
		if (!server) return false;

		server.votes = Number(number);
		return await db.set('servers', servers);
	}

	async setServerBoost({ channelID, time, enabled = true }) {
		const servers = await this.getServers();
		const server = servers.find((s) => s?.channel_id == channelID || s?.id == channelID);
		if (!server) return false;

		server.boost_endAt = time;
		server.boosted = enabled;
		return await db.set('servers', servers);
	}

	async setAllServersBoost({ time, enabled = true }) {
		let servers = await this.getServers();
		servers.forEach((server) => {
			server.boost_endAt = time;
			server.boosted = enabled;
		});

		return await db.set('servers', servers);
	}

	async getAllServers({ category, limit, sort = true } = {}) {
		let servers = await this.getServers();
		if (category) servers = servers.filter((server) => server?.category == category);
		if (sort) servers = servers.sort((a, b) => b.votes - a.votes);
		if (limit) servers = servers.slice(0, limit);

		return servers.map((server) => ({
			id: server.id,
			category: server.category,
			channelID: server.channel_id,
			guildID: server.guild_id,
			ownerID: server.owner_id,
			moderatorID: server.moderator_id,
			votes: server.votes ?? 0,
			name: server.name,
			description: server.description,
			image: server.image,
			invite: server.invite,
			messageId: server.messageId,
			boosted: Boolean(server?.boosted),
			boostEndedAt: server?.boost_endAt
		}));
	}

	async createVoteEvent({ userID, channelID, boosted = false, date = new Date() }) {
		const result = await db.push('servers', {
			channel_id: channelID,
			user_id: userID,
			channel_id: channelID,
			date: date.toISOString(),
			boosted: boosted
		});

		return result;
	}

	async getVoteEvents({ userID, channelID } = {}) {
		const events = (await db.get('vote_events')) || [];
		let filteredEvents = events;
		if (userID) filteredEvents = filteredEvents.filter((event) => event.user_id == userID);
		if (channelID) filteredEvents = filteredEvents.filter((event) => event.channel_id == channelID);

		return filteredEvents.map((event) => ({
			userID: event.user_id,
			channelID: event.channel_id,
			date: event.date,
			boosted: Boolean(event?.boosted)
		}));
	}

	// ---------------------------------------------- [ Util ] ----------------------------------------------

	#getRandomID() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	#isArray(obj) {
		return Array.isArray(obj) || obj instanceof Array;
	}
}

module.exports.Database = Database;
