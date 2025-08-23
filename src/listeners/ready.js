const { Listener } = require('@sapphire/framework');
const { blue, gray, green, magenta, magentaBright, white, yellow } = require('colorette');

const dev = process.env.NODE_ENV !== 'production';
const style = dev ? yellow : blue;
const config = require('../config');
const client = require('../index');
const Discord = require('discord.js');
class UserEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			once: false
		});
	}

	async run() {
		const guild = client.guilds.cache.get(config.guildId);
		let counter = 0;
		for (const category of config.categories) {
			const filter = guild.channels.cache.filter((x) => x.parentId == category.parentId).toJSON();
			for (const _ of filter) {
				counter++
			}
		}

		if (guild) {
			client.user.setActivity({
				type: Discord.ActivityType.Watching,
				name: `${Number(guild.memberCount + 1).toLocaleString()} members | ${counter} servers in list`
			});
			setInterval(
				async () => {
					try {
						for (const category of config.categories) {
							await func.sortChannels(guild, category.type);
							const allServers = await client.db.getAllServers({
								category: category.parentId,
								sort: false
							});
							try {
								const filter = guild.channels.cache.filter((x) => x.parentId == category.parentId).toJSON();
								for (const channel of filter) {
									const server = await client.db.getServer(channel.id);
									if (channel.name != `${channel.position + 1}-${server.name}`) {
										channel.setName(`${channel.position + 1}-${server.name}`);
									}
								}
							} catch (error) {
								console.error(error);
							}
						}
					} catch (error) {
						return;
					}
				},
				1000 * 60 * 10
			);

			setInterval(
				async () => {
					const _servers = (await client.db.getAllServers()) ?? [];
					const _guild = client.guilds.cache.get(config.guildId);
					let counter = 0;
					for (const category of config.categories) {
						const filter = guild.channels.cache.filter((x) => x.parentId == category.parentId).toJSON();
						for (const _ of filter) {
							counter++;
						}
					}

					client.user.setActivity({
						type: Discord.ActivityType.Watching,
						name: `${Number(_guild.memberCount + 1).toLocaleString()} members | ${counter} servers in list`
					});
				},
				25 * (1000 * 60)
				// 1000
			);
		}
	}

	printBanner() {
		const success = green('+');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}


}

module.exports = {
	UserEvent
};
