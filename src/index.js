const Discord = require('discord.js');
const { Intents } = require('discord.js');
const Enmap = require("enmap");
const client = new Discord.Client({
    ws: { intents },
  });
  
require("dotenv").config();
const prefix = process.env.PREFIX;

const roleList = new Enmap();
const muteList = new Enmap();


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

function muteCommand(message, args) {
    const member = message.guild.members.cache.find(member => member.user.username === args[0] || member.id === args[0]);
    if(!member) return message.reply("User not found");
    let muteRole = message.guild.roles.cache.find(role => role.name === "Muted");
    if(!muteRole){
        try {
            muteRole = message.guild.roles.create({
                data: {
                  name: "Muted",
                  color: "#000000",
                  permissions: []
                }
              })
            message.guild.channels.cache.forEach(channel => {
                channel.updateOverwrite(muteRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SPEAK: false
                });
            });
        } catch (error) {
            console.log(error.stack);
        }
    }
    if(member.roles.cache.has(muteRole.id)){
        return message.reply("This user is already muted!");
    }else{
        member.roles.add(muteRole).then(() => {
            message.reply(`${member.user.username} has been muted.`);
        }).catch(error => {
            message.reply(`Sorry, an error occured. ${error}`);
        });
    }
}

function unmuteCommand(message, args) {
    const member = message.guild.members.cache.find(member => member.user.username === args[0] || member.id === args[0]);
    if(!member) return message.reply("User not found");
    let muteRole = message.guild.roles.cache.find(role => role.name === "Muted");
    if(!muteRole) return message.reply("Muted role not found");
    if(!member.roles.cache.has(muteRole.id)){
        return message.reply("This user is not muted!");
    }else{
        member.roles.remove(muteRole).then(() => {
            message.reply(`${member.user.username} has been unmuted.`);
        }).catch(error => {
            message.reply(`Sorry, an error occured. ${error}`);
        });
    }
}
      
client.on('message', message => {
    if (message.content.startsWith("/ban")) {
        banCommand(message, message.content.split(" ").slice(1));
    }
    if (message.content.startsWith("/kick")) {
        kickCommand(message, message.content.split(" ").slice(1));
    }
    if (message.content.startsWith("/mute")) {
        muteCommand(message, message.content.split(" ").slice(1));
    }
     if (message.content.startsWith("/unmute")) {
        unmuteCommand(message, message.content.split(" ").slice(1));
    }
});
    

client.login(process.env.TOKEN);