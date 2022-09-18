/* 
    trialBot, a super simple bot that gives you the ability to give a user a role for a 
    certain number of days, after the time is reached, the role is removed.
*/
var mysql =  require('promise-mysql');
var schedule = require('node-schedule');

const Discord = require('discord.js');
const client = new Discord.Client();
var config = require('./config.json');
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : config.dbHost,
    user     : config.dbUsername,
    password : config.dbPassword,
    database : config.dbName,
    debug    :  false
});
var connection;

client.on('ready', () => {
  console.log('trialBot started.');
    mysql.createConnection({
        host: config.dbHost,
        user: config.dbUsername,
        password: config.dbPassword
    }).then(conn => {
        connection = conn;
        return connection.query('SHOW DATABASES LIKE ?;', config.dbName);
    }).then(rows => {
        if (!rows[0]) {
            console.log('database does not exist')
        }
    }); 
});

client.on('message', msg => {
    if (msg.content.startsWith('!role')) {
        if (verifyUser(msg.author.id)) {
            let member = msg.mentions.members.first();
            let role = msg.mentions.roles.first().id;
            let days = parseInt(msg.content.split(" ")[3]);
            if (Number.isInteger(days)) {
                addRole(member, role, days);
            } else {
                const guild = client.guilds.find(guild => guild.id === config.serverId);
                const logChannel = guild.channels.find(channel => channel.id === config.logChannelId);
                logChannel.send(days + ' is not a valid number.');
            }
        }
    }
});

addRole = (member, roleId, amountOfDays) => {
    const guild = client.guilds.find(guild => guild.id === config.serverId);
    const logChannel = guild.channels.find(channel => channel.id === config.logChannelId);
    const roleToAdd = guild.roles.find(r => r.id === roleId);
    let checkSql = 'SELECT expires FROM users WHERE id = ? AND role = ?';
    let checkParams = [member.user.id, roleId];
    pool.getConnection().then(connection => {
		connection.query(checkSql, checkParams).then(rows => {
            connection.release();
            if (rows[0]) {
                let dateToAddTo = new Date(rows[0].expires);
                updateExpirationDate(member.user.id, roleId, amountOfDays, dateToAddTo);
                logChannel.send('Added ' + amountOfDays + ' days to ' + member.user.username + '\s subscription.');
            } else {
                insertMemberIntoDb(member.user.id, roleId, amountOfDays)
                member.addRole(roleToAdd).catch(err => console.log(err));
                logChannel.send('Added "' + roleToAdd.name + '" role and ' + amountOfDays + ' days to ' + member.user.username + '\s subscription.');
            }
        });
    });
}

updateExpirationDate = (memberId, roleId, amountOfDays, dateToAddTo) => {
    let updateSql = 'UPDATE users SET expires = ? WHERE id = ? AND role = ?';
    let expireDate = addDays(amountOfDays, dateToAddTo);
    let updateParams = [expireDate, memberId, roleId];
    pool.getConnection().then(connection => {
		connection.query(updateSql, updateParams).then(rows => {
            connection.release();
        });
    });
}

insertMemberIntoDb = (memberId, roleId, amountOfDays) => {
    let insertSql = 'INSERT INTO users (id, role, expires) VALUES (?, ?, ?);';
    let expireDate = addDays(amountOfDays);
    let insertParams = [memberId, roleId, expireDate];
    pool.getConnection().then(connection => {
		connection.query(insertSql, insertParams).then(rows => {
            connection.release();
        });
    });
}

addDays = (days, date) => {
    var result = date ? new Date(date) : new Date();
    result.setDate(result.getDate() + days);
    return result;
  }

verifyUser = (id) => {
    const guild = client.guilds.find(guild => guild.id === config.serverId);
    let member = guild.members.find(member => member.id === id);

    return member.roles.find(role => role.name === config.commanderRole);
}

removeRoles = () => {
    let guild = client.guilds.find(guild => guild.id === config.serverId);
    let rowsToRemoveSql = 'SELECT * FROM users WHERE expires < CURRENT_TIMESTAMP()';
    let logChannel = guild.channels.find(channel => channel.id === config.logChannelId);

    pool.getConnection().then(connection => {
		connection.query(rowsToRemoveSql).then(rows => {
            connection.release();
            if (rows.length > 0) {
                rows.forEach(row => {
                    let guild = client.guilds.find(guild => guild.id === config.serverId);
                    let role = guild.roles.find(r => r.id === row.role);
                    let member = guild.members.find(mem => mem.id === row.id);
                    member.removeRole(role);
                    logChannel.send('Removed "' + role.name + '" from ' + member.user.username);
                });
            }
        });
    });
}

deleteExpiredUsers = () => {
    let removeSql = 'DELETE FROM users WHERE expires < CURRENT_TIMESTAMP()';
    pool.getConnection().then(connection => {
		connection.query(removeSql).then(() => {
            connection.release();
        });
    });

}

schedule.scheduleJob('0 */8 * * *', () => { 
    removeRoles();
    deleteExpiredUsers();
});

client.login(config.token);