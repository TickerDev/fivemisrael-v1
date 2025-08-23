const { Listener } = require('@sapphire/framework');
const { blue, gray, green, magenta, magentaBright, white, yellow } = require('colorette');
const config = require('../config');
const client = require('../index');
const Discord = require('discord.js');
const quick = require("quick.db").QuickDB;
const db = new quick({ table: "memberroles" })
class UserEvent extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            once: false
        });
    }

    async run(member) {
        try {
            const roles = member.roles.cache.map(role => role.id);
            await db.set(`${member.guild.id}.${member.id}.roles`, roles);
        } catch (error) {
            return []
        }
    }

}

module.exports = {
    UserEvent
};