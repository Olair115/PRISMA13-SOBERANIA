# PRISMA13 - Monorepo

## Estrutura

```text
.
|-- public/                    # app estatico atual, 20 telas
|-- apps/
|   |-- prisma13-static/       # wrapper do app publicado
|   `-- prisma13-react/        # migracao React/Vite
|-- packages/
|   |-- core/                  # regras puras do PRISMA13
|   `-- integrations/          # clientes reais de API
|-- functions/                 # Firebase Functions
|-- docs/                      # arquitetura, integracoes e deploy
`-- Dockerfile
```

## Decisao de arquitetura

O `public/` continua como fonte de deploy do Firebase Hosting. A migracao para React deve ser progressiva: primeiro contratos reais de dados e testes; depois cada tela estatica vira componente.

Essa abordagem evita perder a qualidade visual das 20 telas ja ajustadas e cria base tecnica para auth, health data e wearables.

## Dominios

- `@prisma13/core`: escala 1-13, bandas, snapshots e dimensoes.
- `@prisma13/integrations`: clientes browser para Firebase Auth, backend de saude e wearable bridges.
- `functions/src`: endpoints reais e verificacao de token Firebase.

