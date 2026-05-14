# PRISMA13 Monorepo

Este repositorio agora esta organizado como monorepo sem quebrar o app atual.

- `public/`: app estatico publicado hoje no Firebase Hosting, com as 20 telas.
- `apps/prisma13-static/`: wrapper de workspace para rodar o app estatico.
- `apps/prisma13-react/`: base React/Vite para migracao progressiva.
- `packages/core/`: regras puras do PRISMA13, escores e dimensoes.
- `packages/integrations/`: clientes reais para auth, dados de saude e wearables.
- `functions/`: Firebase Functions com endpoints reais para auth verificado, Google Fit e importacao Apple Health.
- `docs/`: arquitetura, integracoes e deploy.

Comandos principais:

```bash
npm run dev
npm test
npm run test:react
npm run validate:static
npm run deploy:firebase
npm run docker:build
```

O app de producao continua em `public/`. O React entra como proxima camada, sem substituir as telas ja validadas.

No Windows desta maquina, se `npm` apontar para `AppData\\Roaming\\npm` e falhar, rode pelo Node oficial:

```powershell
& "C:\\Program Files\\nodejs\\node.exe" "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js" run validate:static
```

As tarefas em `.vscode/tasks.json` ja usam esse caminho seguro quando necessario.

Nota pratica: `npm test` valida `functions` e `packages/core` sem depender da instalacao pesada do React. O `npm run test:react` fica separado e deve ser rodado depois de `npm install`, porque baixa React, Vite, Jest DOM e React Testing Library.
