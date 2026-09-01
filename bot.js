const { Client, GatewayIntentBits, ActivityType, PermissionFlagsBits, Events, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { setupSuggestions, initSuggestionsPersistentConfig } = require('./suggestions');
const { setupManagementExtras, initManagementPersistentConfig } = require('./management-extras');
const { setupTickets, initTicketsPersistentConfig } = require('./tickets');
const { initPersistentConfig } = require('./persistent-config');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const token = String(process.env.DISCORD_TOKEN || '').trim();

if (!token) {
  console.error('❌ DISCORD_TOKEN ausente. Adicione o token novo nas variáveis/secret da Discloud.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

// Os outros módulos aguardam esta Promise antes de registrar comandos,
// atualizar painéis ou aceitar interações. Assim o backup do Discord é
// restaurado ANTES de qualquer configuração local poder sobrescrevê-lo.
let releaseStartup;
const startupReady = new Promise(resolve => { releaseStartup = resolve; });

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'CDA Gestão', type: ActivityType.Watching }],
    status: 'online'
  });

  try {
    const guild = await client.guilds.fetch(config.guildId);

    // Primeiro puxa o /botconfig do canal #cda-bot-storage criado pela versão antiga.
    // Só depois os módulos são liberados para ler/salvar configurações.
    await initPersistentConfig(client, guild.id);
    await initSuggestionsPersistentConfig();
    await initManagementPersistentConfig();
    await initTicketsPersistentConfig();
    console.log('✅ Restauração do canal de storage concluída antes da inicialização dos sistemas.');

    const me = await guild.members.fetchMe();
    console.log(`🏙️ Servidor: ${guild.name} (${guild.id})`);
    console.log(`👥 Guild Members Intent: ativo no código`);
    console.log(`🛡️ Manage Roles: ${me.permissions.has(PermissionFlagsBits.ManageRoles) ? 'SIM' : 'NÃO'}`);

    const configured = (config.hierarchy || []).filter(r => r.roleId).length;
    console.log(`📚 Hierarquia carregada: ${configured} cargos`);
    if (process.env.BASE_URL) console.log(`🌐 Painel: ${process.env.BASE_URL}`);
  } catch (e) {
    console.error('⚠️ Falha ao validar servidor/permissões/storage:', e.message);
  } finally {
    releaseStartup();
  }
});

client.on('error', e => console.error('❌ Discord client:', e.message));
client.on('warn', m => console.warn('⚠️ Discord:', m));

process.on('unhandledRejection', e => console.error('❌ Promise:', e?.message || e));
process.on('uncaughtException', e => console.error('❌ Exception:', e?.message || e));

setupSuggestions(client, startupReady);
setupManagementExtras(client, startupReady);
setupTickets(client, startupReady);
client.login(token).catch(e => {
  console.error('❌ Não foi possível conectar o bot:', e.message);
  process.exit(1);
});

