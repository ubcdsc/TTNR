// Require the necessary discord.js classes
const fs = require('fs');
const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

// Create a new client instance
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.on('ready', () => {
	console.log('TTNR is logged in as: ' + client.user.tag);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
