import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { createRequire } from "module";
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const require = createRequire(import.meta.url);
var config = require('./config.json')

const addCommand = new SlashCommandBuilder()
	.setName('add')
	.setDescription('Will add the role to the user in the server for the number of days specified.')
	.addRoleOption(option =>
		option.setName('role').setDescription('The role to add').setRequired(true))
  .addUserOption(option => 
    option.setName('user').setDescription('The user to add the role to').setRequired(true))
  .addIntegerOption(option => 
    option.setName('time').setDescription('Amount of time to give the user the role for').setRequired(true))
  .addStringOption(option =>
    option.setName('type')
      .setDescription('Would you like to give the user the time in minutes, hours, or days')
      .setRequired(true)
      .addChoices(
        { name: 'minutes', value: 'minute' },
        { name: 'hours', value: 'hour' },
        { name: 'days', value: 'day' },
      ))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

const setLogChannelCommand = new SlashCommandBuilder()
	.setName('set-log-channel')
	.setDescription('Will set this channel as the servers log channel.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const commands = [addCommand, setLogChannelCommand];
const rest = new REST({ version: '9' }).setToken(config.token);
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(config.applicationId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
