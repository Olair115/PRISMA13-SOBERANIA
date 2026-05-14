# @prisma13/react

Base React/Vite para migrar as telas do PRISMA13 sem descartar o app estatico.

O hook `useAuth` usa Firebase Auth real. O hook `useHealthData` chama os endpoints reais em `/api/*`, exigindo ID token.

```bash
npm install
npm run dev -w @prisma13/react
npm run test -w @prisma13/react
```

Esta camada deve substituir as telas estaticas aos poucos, tela por tela.
