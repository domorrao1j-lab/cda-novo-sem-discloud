STORAGE VIA DISCORD - CDA GESTAO

Esta versão volta a ser compatível com o canal criado pela versão antiga:
  #cda-bot-storage

Ao iniciar/deployar, o bot:
1. Entra no servidor configurado em config.json.
2. Procura #cda-bot-storage (ou reconhece o tópico antigo se o canal tiver sido renomeado).
3. Lê as mensagens antigas no formato CDA_CONFIG::...
4. Restaura automaticamente:
   - suggestions
   - management_extras (Avaliações + Bugs)
5. Só então libera comandos, interações e atualizações automáticas.
6. Toda alteração futura do /botconfig volta a ser sincronizada com o canal.

IMPORTANTE:
- Não apague o canal cda-bot-storage.
- O bot precisa conseguir Ver Canal, Ler Histórico e Enviar Mensagens nesse canal.
- Se o canal antigo existir e contiver as mensagens CDA_CONFIG::, não é necessário configurar tudo novamente.
