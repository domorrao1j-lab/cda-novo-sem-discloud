CDA Gestão — V5.4

NOVIDADES
- IA com fallback automático: se Gemini falhar (incluindo HTTP 429/cota), tenta Groq quando GROQ_API_KEY estiver configurada. Se Groq falhar e Gemini estiver disponível, também tenta o outro provedor.
- Erros técnicos da IA não são mais despejados no ticket; o usuário recebe uma mensagem curta e o detalhe fica no console/log.
- Abertura do ticket agora mostra somente 4 botões: Assumir, Painel Staff, Painel Membro e Fechar ticket.
- Painel Staff (somente equipe): Transferir, Sugerir resposta IA e Resumir ticket.
- Painel Membro (somente equipe): Adicionar ao ticket e Remover do ticket.

VARIÁVEIS
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.6-flash
GROQ_API_KEY=...
GROQ_MODEL=llama-3.3-70b-versatile

IMPORTANTE
Para o fallback funcionar de verdade, configure as duas chaves na Discloud. Se apenas uma estiver configurada, o bot usa somente aquela.
