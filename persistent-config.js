const { ChannelType, PermissionFlagsBits } = require('discord.js');

// Compatível com o canal criado pelas versões antigas do bot.
const STORAGE_CHANNEL_NAME = 'cda-bot-storage';
const PREFIX = 'CDA_CONFIG::';
const TEXT_PREFIX = 'CDA_TEXT::';
const TEXT_CHUNK_SIZE = 1650;

let storageChannel = null;
let enabled = false;
const messageCache = new Map();
const textCache = new Map();

function serialize(key, value) {
  return `${PREFIX}${String(key)}::${JSON.stringify(value)}`;
}

function parseMessage(content) {
  if (!content?.startsWith(PREFIX)) return null;
  const rest = content.slice(PREFIX.length);
  const sep = rest.indexOf('::');
  if (sep < 1) return null;

  const key = rest.slice(0, sep);
  try {
    return { key, value: JSON.parse(rest.slice(sep + 2)) };
  } catch {
    return null;
  }
}

function serializeTextChunk(key, version, index, total, text) {
  return `${TEXT_PREFIX}${String(key)}::${version}::${index}::${total}::${text}`;
}

function parseTextChunk(content) {
  if (!content?.startsWith(TEXT_PREFIX)) return null;
  const rest = content.slice(TEXT_PREFIX.length);
  const parts = rest.split('::');
  if (parts.length < 5) return null;
  const key = parts.shift();
  const version = Number(parts.shift());
  const index = Number(parts.shift());
  const total = Number(parts.shift());
  const text = parts.join('::');
  if (!key || !Number.isFinite(version) || !Number.isInteger(index) || !Number.isInteger(total) || index < 0 || total < 1) return null;
  return { key, version, index, total, text };
}

function isStorageTopic(channel) {
  return channel?.type === ChannelType.GuildText &&
    String(channel.topic || '').toLowerCase().includes('armazenamento interno das configura');
}

function registerTextChunk(msg, parsed) {
  const current = textCache.get(parsed.key);
  if (!current || parsed.version > current.version) {
    textCache.set(parsed.key, {
      version: parsed.version,
      total: parsed.total,
      chunks: new Map([[parsed.index, parsed.text]]),
      messages: new Map([[parsed.index, msg]]),
    });
    return;
  }
  if (parsed.version === current.version) {
    current.total = parsed.total;
    if (!current.chunks.has(parsed.index)) current.chunks.set(parsed.index, parsed.text);
    if (!current.messages.has(parsed.index)) current.messages.set(parsed.index, msg);
  }
}

async function initPersistentConfig(client, guildId) {
  try {
    const guild = await client.guilds.fetch(String(guildId));
    await guild.channels.fetch();

    storageChannel = guild.channels.cache.find(ch =>
      ch.type === ChannelType.GuildText && ch.name === STORAGE_CHANNEL_NAME
    ) || null;

    if (!storageChannel) {
      storageChannel = guild.channels.cache.find(isStorageTopic) || null;
    }

    if (!storageChannel) {
      storageChannel = await guild.channels.create({
        name: STORAGE_CHANNEL_NAME,
        type: ChannelType.GuildText,
        topic: 'Armazenamento interno das configurações do bot. Não apague este canal.',
        permissionOverwrites: [
          { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
          {
            id: client.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.ManageMessages,
            ],
          },
        ],
        reason: 'Armazenamento persistente do /botconfig',
      });
      console.log(`💾 Canal privado #${STORAGE_CHANNEL_NAME} criado para persistir o /botconfig.`);
    } else {
      console.log(`💾 Canal de storage encontrado: #${storageChannel.name} (${storageChannel.id}).`);
    }

    messageCache.clear();
    textCache.clear();

    // 100 mensagens comportam a base da IA de 50 mil caracteres + configs comuns.
    const messages = await storageChannel.messages.fetch({ limit: 100 });
    for (const msg of messages.values()) {
      if (msg.author.id !== client.user.id) continue;

      const textParsed = parseTextChunk(msg.content);
      if (textParsed) {
        registerTextChunk(msg, textParsed);
        continue;
      }

      const parsed = parseMessage(msg.content);
      if (parsed && !messageCache.has(parsed.key)) {
        messageCache.set(parsed.key, msg);
      }
    }

    enabled = true;
    console.log(`💾 Persistência Discord ativa. ${messageCache.size} configuração(ões) e ${textCache.size} texto(s) grande(s) encontrado(s).`);
    return true;
  } catch (err) {
    enabled = false;
    storageChannel = null;
    messageCache.clear();
    textCache.clear();
    console.error('❌ Não foi possível ativar a persistência pelo Discord:', err.message);
    console.warn('⚠️ O bot continuará usando o storage local nesta execução.');
    return false;
  }
}

async function loadPersistentConfig(key, fallback) {
  if (!enabled || !storageChannel) return fallback;
  const k = String(key);

  try {
    let msg = messageCache.get(k);

    if (!msg) {
      const content = serialize(k, fallback);
      if (content.length > 2000) {
        console.error(`❌ Configuração ${k} ficou grande demais para o armazenamento no Discord.`);
        return fallback;
      }
      msg = await storageChannel.send({ content, allowedMentions: { parse: [] } });
      messageCache.set(k, msg);
      console.log(`💾 ${k}: nenhum backup antigo; valor local salvo no canal.`);
      return fallback;
    }

    const fresh = await storageChannel.messages.fetch(msg.id).catch(() => msg);
    const parsed = parseMessage(fresh.content);
    if (!parsed || !parsed.value || typeof parsed.value !== 'object') {
      console.warn(`⚠️ ${k}: mensagem de storage inválida; mantendo valor local.`);
      return fallback;
    }

    messageCache.set(k, fresh);
    console.log(`✅ ${k}: configuração restaurada do #${storageChannel.name}.`);
    return parsed.value;
  } catch (err) {
    console.error(`❌ Falha ao carregar configuração persistente (${k}):`, err.message);
    return fallback;
  }
}

async function savePersistentConfig(key, value) {
  if (!enabled || !storageChannel) return false;
  const k = String(key);

  try {
    const content = serialize(k, value);
    if (content.length > 2000) {
      console.error(`❌ Configuração ${k} ficou grande demais para o armazenamento no Discord.`);
      return false;
    }

    let msg = messageCache.get(k);
    if (msg) msg = await msg.edit({ content, allowedMentions: { parse: [] } });
    else msg = await storageChannel.send({ content, allowedMentions: { parse: [] } });
    messageCache.set(k, msg);
    return true;
  } catch (err) {
    console.error(`❌ Falha ao salvar configuração persistente (${k}):`, err.message);
    return false;
  }
}

function splitText(text, chunkSize = TEXT_CHUNK_SIZE) {
  const value = String(text ?? '');
  const chunks = [];
  for (let i = 0; i < value.length; i += chunkSize) chunks.push(value.slice(i, i + chunkSize));
  return chunks.length ? chunks : [''];
}

async function loadPersistentText(key, fallback = '') {
  if (!enabled || !storageChannel) return String(fallback ?? '');
  const k = String(key);
  try {
    const cached = textCache.get(k);
    if (!cached) {
      if (String(fallback ?? '').length) await savePersistentText(k, String(fallback));
      return String(fallback ?? '');
    }
    if (cached.chunks.size < cached.total) {
      console.warn(`⚠️ ${k}: texto grande incompleto no storage (${cached.chunks.size}/${cached.total}); mantendo valor local.`);
      return String(fallback ?? '');
    }
    let text = '';
    for (let i = 0; i < cached.total; i++) {
      if (!cached.chunks.has(i)) return String(fallback ?? '');
      text += cached.chunks.get(i);
    }
    console.log(`✅ ${k}: texto grande restaurado do #${storageChannel.name} (${text.length} caracteres).`);
    return text;
  } catch (err) {
    console.error(`❌ Falha ao carregar texto persistente (${k}):`, err.message);
    return String(fallback ?? '');
  }
}

async function savePersistentText(key, text) {
  if (!enabled || !storageChannel) return false;
  const k = String(key);
  const value = String(text ?? '');
  const chunks = splitText(value);
  const version = Date.now();
  const sent = new Map();

  try {
    for (let index = 0; index < chunks.length; index++) {
      const content = serializeTextChunk(k, version, index, chunks.length, chunks[index]);
      if (content.length > 2000) throw new Error(`chunk ${index} excedeu o limite do Discord`);
      const msg = await storageChannel.send({ content, allowedMentions: { parse: [] } });
      sent.set(index, msg);
    }

    const old = textCache.get(k);
    textCache.set(k, {
      version,
      total: chunks.length,
      chunks: new Map(chunks.map((chunk, index) => [index, chunk])),
      messages: sent,
    });

    if (old?.messages) {
      for (const msg of old.messages.values()) await msg.delete().catch(() => {});
    }
    console.log(`💾 ${k}: texto grande salvo em ${chunks.length} parte(s), ${value.length} caracteres.`);
    return true;
  } catch (err) {
    console.error(`❌ Falha ao salvar texto persistente (${k}):`, err.message);
    for (const msg of sent.values()) await msg.delete().catch(() => {});
    return false;
  }
}

module.exports = {
  STORAGE_CHANNEL_NAME,
  initPersistentConfig,
  loadPersistentConfig,
  savePersistentConfig,
  loadPersistentText,
  savePersistentText,
};
