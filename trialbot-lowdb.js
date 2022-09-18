/* 
    trialBot, a super simple bot that gives you the ability to give a user a role for a 
    certain amount of time, after the time is reached, the role is removed.
*/
import { createRequire } from "module";
import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
import {
    Client, GatewayIntentBits
} from "discord.js";
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

var config = require('./config.json');
var schedule = require('node-schedule');

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();

// db structure expects
// {
//     serverId: "123",
//     serverName: "abc",
//     logChannelId: "123",
//     expireData: [{
//         username: "username",
//         id: "userid",
//         roleId: "roleid",
//         roleName: "roleName"
//         expires: "2022-12-17T03:24:00"
//       }]
// }

db.data = db.data || [];

client.db = db;

client.on('ready', () => {
  console.log(`${client.user.tag} ready!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (!interaction.inGuild()) {
        interaction.reply({ content: `This command must be run in a guild.`, ephemeral: true });
        return;
    }

    let guildExists = db.data.find(a => a.serverId === interaction.guild.id);

    if (!guildExists) {
        db.data.push({
            serverId: interaction.guild.id,
            serverName: interaction.guild.name,
            logChannelId: null,
            expireData: []
        });
        await db.write();
    }

    if (interaction.commandName === 'add') {
        const role = interaction.options.getRole('role');
        const member = interaction.options.getMember('user');
        const amount = interaction.options.getInteger('time');
        const type = interaction.options.getString('type');

        addRole(interaction.guild, member, role, amount, type).then(() => {
            interaction.reply({ content: `Added ${role.name} to ${member.user.username} for ${amount} ${type}.`, ephemeral: true });
        }).catch(e => {
            interaction.reply({ content: `Unable to add role to ${member.user.username} for ${amount} ${type}. See console for error.`, ephemeral: true });
            console.log(e);
        });
    }

    if (interaction.commandName === 'set-log-channel') {
        let serverData = db.data.find(s => s.serverId === interaction.guild.id);
        serverData.logChannelId = interaction.channelId;
        await db.write();
        interaction.reply({ content: `I set this channel as this servers log channel.`, ephemeral: true });
    }
});

let addRole = async (guild, member, role, amount, type) => {
    return new Promise(async (resolve, reject) => {
        let serverData = db.data.find(s => s.serverId === guild.id);
        const roleToAdd = await guild.roles.fetch(role.id).catch(reject);
        let existingEntry = serverData.expireData.find(obj => obj.roleId === role.id && obj.id === member.id);
        if (existingEntry) {
            const dateToAddTo = new Date(existingEntry.expires);
            existingEntry.expires = addTime(amount, type, dateToAddTo);
            await db.write().catch(reject);
            resolve();
        } else {
            await member.roles.add(roleToAdd).then(async () => {
                serverData.expireData.push({
                    username: member.user.username,
                    id: member.user.id,
                    roleName: role.name,
                    roleId: role.id,
                    expires: addTime(amount, type)
                });
                await db.write().catch(reject);
                resolve();
            }).catch(reject);
        }
    });
}

let addTime = (amount, type, date) => {
    var dateObj = date ? new Date(date) : new Date();

    switch (type) {
        case 'minute': 
            dateObj.setMinutes(dateObj.getMinutes() + amount);
            return dateObj.toISOString();
        case 'hour': 
            dateObj.setHours(dateObj.getHours() + amount);
            return dateObj.toISOString();
        case 'day': 
            dateObj.setDate(dateObj.getDate() + amount);
            return dateObj.toISOString();
    }
}

let removeRoles = async () => {
    return new Promise(async resolve => {
        for (const serverData of db.data) {
            let guild = client.guilds.cache.find(g => g.id === serverData.serverId);
            if (guild) {
                const logChannel = await guild.channels.fetch(serverData.logChannelId);
                let expiredRoles = serverData.expireData.filter(obj => new Date(obj.expires) < new Date());
                var data = {
                    removedRolesFrom: [],
                    removalErrors: []
                };
                for (const dbEntry of expiredRoles) {
                    const role = await guild.roles.fetch(dbEntry.roleId);
                    const member = await guild.members.fetch(dbEntry.id);
                    try {
                        await member.roles.remove(role);
                        const exisingLog = data.removedRolesFrom.find(l => l.userName === member.user.username);
                        if (exisingLog) {
                            data.removedRolesFrom.find(l => l.userName === member.user.username).removals.push(role.name);
                        } else {
                            data.removedRolesFrom.push({
                                userName: member.user.username,
                                removals: [role.name]
                            });
                        }
                    } catch(e) {
                        const existingErrors = data.removalErrors.find(l => l.userName === member.user.username);
                        if (existingErrors) {
                            data.removalErrors.find(l => l.userName === member.user.username).errors.push(role.name);
                        } else {
                            data.removalErrors.push({
                                userName: member.user.username,
                                roleName: role.name,
                                errors: [`Unable to remove ${role.name} from ${member.user.username}. See console for error.`]
                            });
                        }
                        console.log(e);
                    }
                }
                sendFile(data, logChannel);
                resolve(data);
            } else {
                console.error(`Bot is no longer in server ${serverData.serverName}, not removing any roles there.`);
            }
        }
    });
}

let sendFile = (data, logChannel) => {
    if (data.removedRolesFrom.length > 0 || data.removalErrors.length > 0 ) {
        var buf = Buffer.from(JSON.stringify(data, null, 4));
        logChannel.send({
            files: [
            {
                attachment: buf,
                name: `expiredRoleReport.json`,
            }],
        });
    }
}

let deleteExpiredUsers = async (data) => {
    for (const serverData of db.data) {
        // Don't delete entries if there is an error removing the role
        let nonExpiredRoles = serverData.expireData
            .filter(obj => new Date(obj.expires) > new Date() || data.removalErrors.find(r => (r.userName === obj.userName) && (r.roleName === obj.roleName) ));
        serverData.expireData = nonExpiredRoles;
        await db.write();
    }

}

// if you want to allow different servers to schedule different intervals replace this with
// https://github.com/kibertoad/toad-scheduler 

// for testing (every minute) */1 * * * *
// for prod (every hour) 0 */1 * * *
schedule.scheduleJob('0 */1 * * *', () => { 
    removeRoles().then(async (data) => {
        deleteExpiredUsers(data);
    }).catch(console.log);
});

client.login(config.token);

process.on('SIGINT', function () { 
    console.log('shutting down schedulers');
    schedule.gracefulShutdown()
    .then(() => process.exit(0))
});