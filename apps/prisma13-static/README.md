# @prisma13/static

Este workspace aponta para o app estatico real em `../../public`.

Ele existe para o monorepo reconhecer o app atual sem duplicar as 20 telas nem quebrar o deploy do Firebase Hosting.

```bash
npm run dev -w @prisma13/static
npm run validate -w @prisma13/static
```
