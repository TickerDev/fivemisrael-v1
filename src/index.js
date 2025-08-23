require('./lib/setup');
const { LogLevel, SapphireClient } = require('@sapphire/framework');
const { prefix, discord_token, Mongo } = require('./config.json');
const { GatewayIntentBits, Partials } = require('discord.js');
const ClientUtil = require('./custom/functions');
const Discord = require('discord.js');
const config = require("./config")
const { Database } = require('./custom/database');
const TicTacToe = require('discord-tictactoe');

const client = new SapphireClient({
	defaultPrefix: prefix,
	regexPrefix: /^(hey +)?client[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.AutoModerationExecution,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions
	],
	partials: [Partials.Channel, Partials.Message, Partials.Reaction],
	loadMessageCommandListeners: true
});
module.exports = client;
require("./api/index.js")();

const main = async () => {
	try {
		client.logger.info('Logging in');
		console.log(discord_token)
		await client.login(discord_token).catch(err => console.log(err));
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};
client.config = config;
client.util = new ClientUtil(client);
client.func = new ClientUtil(client);
client.db = new Database();

global.db = client.db;
global.config = require('./config');
global.func = new ClientUtil(client);
global.util = new ClientUtil(client);

main();

