CDA GESTÃO — V5.3
=================

NOVO NO /ticketconfig
- 🧠 Base da IA: até 50.000 caracteres, enviada por mensagens.
- ⚙️ Prompt da IA: comportamento separado da base.
- 🏢 Anúncios Times: canal que a IA consulta para saber se há corporação/time disponível.

FLUXO DE CORPORAÇÕES
1. Usuário pergunta sobre assumir time/corporação.
2. IA consulta as 50 mensagens mais recentes do canal configurado.
3. Se não houver disponibilidade clara, não inicia inscrição.
4. Se houver anúncio ativo, pergunta uma pergunta por vez:
   - time desejado;
   - nick/ID Roblox;
   - equipe e quantidade de membros;
   - experiência;
   - disponibilidade;
   - motivo;
   - aceite das regras.
5. Gera resumo.
6. Para a IA automática naquele ticket.
7. Menciona os cargos de atendimento para uma pessoa real continuar.

PERSISTÊNCIA
As configurações antigas continuam no mesmo sistema. A base grande e o prompt são salvos em partes no canal privado #cda-bot-storage para sobreviver aos próximos deploys.
