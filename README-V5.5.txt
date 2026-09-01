CDA GESTÃO — V5.5 TICKETS PRO

NOVO NO SISTEMA DE TICKETS

• Notificar Usuário (Painel Staff): envia uma notificação por DM ao autor do ticket.
• Notificar Staff Resp. (Painel Membro): chama somente o responsável atual do atendimento, com cooldown anti-spam.
• Adicionar/Remover membro virou solicitação: o pedido aparece no ticket e precisa ser aprovado/recusado pelo staff responsável. Se ainda não houver responsável, qualquer cargo de staff configurado pode decidir.
• Escalonar atendimento: registra motivo e chama automaticamente um cargo de atendimento acima do staff atual quando houver hierarquia configurada.
• Prioridade Normal/VIP:
  - Tickets normais NÃO pingam a staff ao abrir.
  - Cargos VIP são configuráveis em /ticketconfig > Cargos.
  - Usuário com cargo VIP abre ticket como VIP e gera ping da equipe.
  - Staff pode alterar a prioridade pelo Painel Staff.
• Motivo de Espera: coloca o ticket em espera com motivo público.
• Lembrete Automático: por padrão após 120 min em espera, o bot lembra o usuário. Pode alterar com TICKET_WAIT_REMINDER_MINUTES.
• Histórico do Usuário: quantidade de tickets, concluídos, média de avaliação e atendimentos recentes.
• Transferência com Motivo: toda transferência exige justificativa e registra logs.
• /ticketdashboard: dashboard da equipe com tickets abertos, concluídos, avaliação geral, resolvidos por staff e tempo médio.
• Feedback pós-ticket: além de 1-5 estrelas, usuário pode escrever um comentário.
• Resumo automático no fechamento: se houver Gemini/Groq disponível, o bot gera resumo final e inclui nos logs.
• Logs organizados: abertura, claim, prioridade, espera, lembrete, escalonamento, notificações, transferências e solicitações de membros.

PERSISTÊNCIA
As novas métricas e estados também possuem backup no canal privado #cda-bot-storage.
O histórico começa a ser coletado a partir desta versão; tickets antigos que não estavam registrados não aparecem retroativamente no dashboard.

IMPORTANTE
Configure em /ticketconfig > Cargos:
1. cargos da Equipe de atendimento;
2. cargos considerados VIP.
