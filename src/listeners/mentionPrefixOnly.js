const { Listener } = require('@sapphire/framework');
const Discord = require('discord.js');
const config = require('../config')
class UserEvent extends Listener {
	async run(message) {
		return message.channel.send({
			embeds: [
				new Discord.EmbedBuilder().setDescription(
					`שלום! <a:wave:1206983878892322886> 
אני הבוט של **פייבאם ישראל** הרשימה מספר אחת בארץ <a:sparkles:1203730475449843722> 
רוצה להכניס את \`השרת רולפליי, החברה, החנות, השרת משחק\` שלך לרשימה?
**פתח טיקט עוד היום!**
כאן לעזור עם כל דבר, הבוט של פייבאם ישראל <a:blobdance:1203730631775752272>`
				).setThumbnail(message.guild.members.me.displayAvatarURL())
					.setAuthor({ name: "הבוט של פייבאם ישראל", iconURL: message.guild.members.me.displayAvatarURL() })
					.setColor(config.embed_color)
			],
			components: [
				new Discord.ActionRowBuilder().setComponents([
					new Discord.ButtonBuilder()
						.setLabel('פנה היום!')
						.setStyle(Discord.ButtonStyle.Link)
						.setURL('https://discord.com/channels/875892539062910977/924071319396569098')
				])
			]
		});
	}
}

module.exports = {
	UserEvent
};
