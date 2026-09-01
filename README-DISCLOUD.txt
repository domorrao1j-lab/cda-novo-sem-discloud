CDA GESTÃO — PACOTE DO BOT / DISCLOUD

Este ZIP é SOMENTE o bot, para ficar online 24/7 na Discloud.
O site/painel continua no Render.

O sistema completo continua com as funções do painel porque:
- a Discloud mantém o bot conectado/online no Discord;
- o Render usa o token do mesmo bot pela API REST para executar as funções de cargos e consultar membros.

CONFIGURAÇÕES PRESERVADAS:
- guildId
- cargo Equipe Staff
- os 13 cargos/IDs da hierarquia
- regras de permissão

UPLOAD NA DISCLOUD:
1) Escolha Upload ZIP.
2) Envie ESTE ZIP fechado.
3) Use o discloud.config incluído (TYPE=bot, MAIN=bot.js, RAM=100).
4) Configure DISCORD_TOKEN com o TOKEN NOVO.
5) BASE_URL é opcional e pode ser a URL do seu Render.

IMPORTANTE:
- Não use o token antigo que apareceu em print.
- No Discord Developer Portal, ative Server Members Intent / Guild Members Intent.
- O cargo do bot deve ficar acima dos 13 cargos que ele vai gerenciar e ter Manage Roles.
- Não coloque token dentro do ZIP.

TICKETS + IA (V5):
- Ative também MESSAGE CONTENT INTENT no Discord Developer Portal para a IA automática ler as mensagens dos tickets.
- O sistema de tickets funciona sem IA.
- Para IA, configure GEMINI_API_KEY ou GROQ_API_KEY nas variáveis/Secrets da Discloud.
- Nunca envie essas chaves nem o DISCORD_TOKEN dentro do ZIP.
