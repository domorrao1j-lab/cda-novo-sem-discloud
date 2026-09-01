CDA GESTÃO • TICKETS + IA (v5)
================================

COMANDOS
- /ticketconfig  -> configura tickets (Administrador)
- /painelticket  -> publica o painel de tickets (Administrador)
- /botconfig     -> agora também possui o botão "Configurar Tickets"

CONFIGURAÇÃO RÁPIDA
1. Faça o deploy do ZIP na Discloud.
2. No Discord, use /botconfig > Configurar Tickets.
3. Em "Canais", escolha:
   - canal público do painel;
   - categoria onde os tickets serão criados;
   - canal privado de logs/transcripts.
4. Em "Cargos", escolha os cargos que podem atender.
5. Clique em "Publicar painel".

IA (OPCIONAL)
A IA não é necessária para o ticket funcionar.

Na Discloud, adicione uma das variáveis:
GEMINI_API_KEY=sua_chave
ou
GROQ_API_KEY=sua_chave

Modelos padrão desta versão:
GEMINI_MODEL=gemini-3.6-flash
GROQ_MODEL=llama-3.3-70b-versatile

Depois use /ticketconfig > IA e escolha:
- Desativada: ticket normal.
- Automática: responde o autor enquanto nenhum staff assumiu.
- Assistente: não responde sozinha; a staff usa os botões de sugestão/resumo.

IMPORTANTE NO DISCORD DEVELOPER PORTAL
Como a IA automática lê mensagens do ticket, ative:
Bot > Privileged Gateway Intents > MESSAGE CONTENT INTENT
O SERVER MEMBERS INTENT já é necessário para outros recursos do bot.

RECURSOS DESTA VERSÃO
- 6 categorias de atendimento.
- Modal com assunto + descrição.
- Um ticket aberto por usuário.
- Canal privado com permissões automáticas.
- Assumir atendimento.
- Transferir para outro staff.
- Adicionar/remover usuários.
- Fechar com motivo.
- Transcript HTML automático nos logs.
- Avaliação 1–5 estrelas por DM.
- IA automática opcional.
- IA assistente: sugestão de resposta.
- IA assistente: resumo do ticket.
- Configuração e contador salvos no canal #cda-bot-storage.
- Base de conhecimento da IA configurável no próprio /ticketconfig.

SEGURANÇA
Nunca coloque GEMINI_API_KEY ou GROQ_API_KEY em config.json ou em mensagens do Discord.
Use apenas as variáveis/Secrets da hospedagem.


=== V5.2 — FUNÇÕES E EMOJIS ===

No /ticketconfig agora existem:

1) Selecionar Funções
- Escolha quais funções aparecem no painel.
- Padrões: Suporte, Denúncia, Bug, Staff, Parceria, Comprar e Outros.
- Crie novas funções com nome e descrição.
- Cada função pode usar uma categoria própria do Discord.
- Se não definir categoria própria, usa a categoria padrão dos tickets.

2) Emojis
- Escolha o emoji da função ou botão/campo que quer alterar.
- O bot pede para enviar o novo emoji como uma mensagem no canal.
- Não usa formulário para trocar emoji.
- Aceita emoji normal e emoji personalizado do Discord.
- A configuração é salva no mesmo storage persistente do sistema de tickets.

Após alterar funções/emojis, use Publicar painel novamente para atualizar o painel público.

=== V5.3 — BASE GRANDE + TIMES/CORPORAÇÕES ===

1) Base da IA ampliada
- A Base da IA agora aceita até 50.000 caracteres.
- Não usa mais modal de 1.500 caracteres.
- Em /ticketconfig > Base da IA, clique em Substituir ou Adicionar.
- Envie o texto em quantas mensagens precisar e depois clique em Finalizar.
- A base grande é dividida automaticamente em várias mensagens no canal privado #cda-bot-storage.

2) Prompt da IA separado
- /ticketconfig agora possui "Prompt da IA" separado da Base da IA.
- O prompt define COMO a IA se comporta.
- A base guarda O QUE a IA sabe sobre o CDA.
- O prompt também pode ser editado por mensagens e restaurado ao padrão CDA.

3) Anúncios de Times / Corporações
- Novo botão: /ticketconfig > Anúncios Times.
- Selecione o canal onde são publicados os times/corporações disponíveis.
- Quando alguém pedir para assumir um time, a IA consulta as 50 mensagens mais recentes desse canal.
- A IA também lê texto de embeds desses anúncios.
- Sem anúncio claro de disponibilidade, ela não inicia candidatura.
- Com anúncio ativo, a IA faz a triagem uma pergunta por vez.
- Após a triagem, gera um resumo, encerra a automação naquele ticket e chama os cargos de staff configurados.
- A IA nunca aprova ou rejeita a pessoa; a decisão final é humana.

4) Base CDA inicial atualizada
Inclui as informações informadas sobre:
- VIP Bronze: R$ 2,75
- VIP Ouro: R$ 9,45
- VIP Platina: R$ 15,00
- VIP Diamante: R$ 25,00
- Velozes e Furiosos: R$ 25,00 (Supra MK4 + Skyline R34)
- Combo Páscoa: R$ 45,99 (Urus + Carrera + 3M em dinheiro do jogo)
- Limousine Exclusiva: R$ 25,00
- Mercedes GT Exclusivo: R$ 18,00
- Mazda RX7 Exclusivo: R$ 21,00
- Bugs, entrada na Staff, Regras, banimentos/advertências e procedimento de corporações.

OBSERVAÇÃO
Estoque pode mudar. A IA foi instruída a não garantir estoque/disponibilidade sem confirmação atual.
