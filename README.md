# Gestao_de_Paradas_Da_Manutencao_Mina

Sistema simples para registrar status de equipamentos da manutencao de mina, com historico, relatorio e filtro por opcao.

## Como iniciar

Nao precisa de servidor.

1. Abra o arquivo `index.html` direto no navegador.
2. Use normalmente as telas do sistema.

Opcional (modo antigo com servidor local):

1. Abra o terminal na pasta do projeto.
2. Execute `npm start`.
3. Acesse `http://127.0.0.1:3000` no navegador.

## Como os dados sao salvos

Os dados ficam persistidos em JSON no navegador (Local Storage), incluindo:

- `equipamentos`
- `historicoParadas`

Esse formato permite rodar o projeto sem `npm start`.

Observacao: ao limpar os dados do navegador, os registros locais tambem sao removidos.

## Deploy no Vercel

Este projeto pode ser publicado no Vercel como site estatico.

### O que foi configurado

- Arquivo `vercel.json` para servir `/` em `index.html`.

### Passos

1. Suba o projeto para um repositorio Git (GitHub, GitLab ou Bitbucket).
2. No Vercel, clique em **New Project** e importe o repositorio.
3. Mantenha as configuracoes padrao (sem Build Command e sem Output Directory customizado).
4. Clique em **Deploy**.

### Importante sobre dados

- Os dados sao salvos no Local Storage do navegador.
- Isso significa que cada navegador/dispositivo tera seus proprios dados.
- Os dados nao sao compartilhados entre usuarios.

## Telas disponiveis

- Painel principal: cadastro e atualizacao de status
- Gestao de parada da manutencao
- Relatorio de parada
- Historico por opcao com filtro por nome e status
