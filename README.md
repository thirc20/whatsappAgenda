<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Sistema desenvolvido para fins de estudo relacionados a api rest.

De forma resumida, o Venon Bot (https://github.com/orkestral/venom) recebe a msg, salva em um banco de dados mysql, e verifica qual a resposta adequada.

Após isso, é enviado um requisição para api do trello.com onde usando um power-up de calendário, é realizado o agendamento.

## Requirements

Node v16
Mysql 8

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```