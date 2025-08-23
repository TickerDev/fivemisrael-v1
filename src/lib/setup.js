require('@sapphire/plugin-logger/register');
require('@sapphire/plugin-api/register');
require('@sapphire/plugin-editable-commands/register');
require('@sapphire/plugin-subcommands/register');
const { ApplicationCommandRegistries, RegisterBehavior } = require('@sapphire/framework');
const { createColors } = require('colorette');
const { inspect } = require('util');
const config = require('../config');
// Set default behavior to bulk overwrite
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
ApplicationCommandRegistries.setDefaultGuildIds([config.guildId]);
// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
createColors({ useColor: true });
