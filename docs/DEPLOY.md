# PRISMA13 - Deploy

## Local

```bash
npm run dev
```

Abre o app estatico em `http://localhost:5500`.

## Firebase

```bash
npm run deploy:hosting
npm run deploy:functions
npm run deploy:firebase
```

Antes do deploy de functions, configurar as variaveis:

```bash
firebase functions:config:set prisma13.allowed_origin="https://prisma13-e339b.web.app"
```

Para Functions v2, prefira variaveis de ambiente no ambiente do Firebase/Google Cloud:

```text
PRISMA13_ALLOWED_ORIGIN
GOOGLE_FIT_CLIENT_ID
GOOGLE_FIT_CLIENT_SECRET
GOOGLE_FIT_REDIRECT_URI
GOOGLE_FIT_SCOPES
```

## Docker

```bash
npm run docker:build
npm run docker:run
```

O container serve o app estatico na porta `8080`.

## Cloud

- AWS: publicar a imagem Docker no ECR e rodar em ECS/App Runner.
- GCP: publicar no Artifact Registry e rodar em Cloud Run.
- Heroku: usar container registry com `heroku container:push web`.

O Firebase Hosting continua sendo o caminho mais direto para o app atual.
