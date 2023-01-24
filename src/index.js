require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

function banCommand(message, args) {
    const member = message.guild.members.cache.find(member => member.user.username === args[0] || member.id === args[0]);
    if(!member) return message.reply("User not found");
    member.ban()
    .then(() => message.reply(`${member.user.username} was banned.`))
    .catch(error => message.reply(`Sorry, an error occured. ${error}`));
}

function kickCommand(message, args) {
    const member = message.guild.members.cache.find(member => member.user.username === args[0] || member.id === args[0]);
    if(!member) return message.reply("User not found");
    member.kick()
    .then(() => message.reply(`${member.user.username} was kicked.`))
    .catch(error => message.reply(`Sorry, an error occured. ${error}`));
}

client.on('message', message => {
    if (message.content.startsWith("/ban")) {
        banCommand(message, message.content.split(" ").slice(1));
    }
    if (message.content.startsWith("/Kick")) {
        kickCommand(message, message.content.split(" ").slice(1));
    }
});

client.login(process.env.TOKEN);