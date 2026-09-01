STORAGE PERSISTENTE - CDA GESTAO

- As configuracoes mutaveis do /botconfig e os dados dos sistemas agora ficam em ./storage/.
- Na primeira inicializacao desta versao, o bot tenta migrar automaticamente os JSON antigos que ja estiverem na Discloud.
- O ZIP de atualizacao NAO deve conter a pasta storage/ nem os quatro JSON mutaveis antigos.
- .discloudignore foi incluido para evitar enviar esses arquivos em commits feitos por ferramentas da Discloud.
- config.json continua no projeto porque contem a hierarquia/base principal e nao faz parte do /botconfig mutavel desses sistemas.

Arquivos persistentes:
  storage/suggestions-config.json
  storage/suggestions-data.json
  storage/management-extras-config.json
  storage/management-extras-data.json
