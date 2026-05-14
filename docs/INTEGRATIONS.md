# PRISMA13 - Integracoes reais

## Auth

O backend usa Firebase Admin para verificar ID tokens recebidos pelo header:

```http
Authorization: Bearer <firebase-id-token>
```

Referencia oficial: https://firebase.google.com/docs/auth/admin/verify-id-tokens

## Google Fit

O PRISMA13 implementa Google Fit REST como integracao legado, com OAuth 2.0 e leitura aggregate.

Importante: a propria documentacao do Google indica que Google Fit API esta em depreciacao e com fim de servico planejado para o fim de 2026. Para Android, o caminho recomendado e Health Connect; para web/cloud, avaliar Google Health API conforme disponibilidade do projeto.

Referencias oficiais:

- https://developers.google.com/fit/rest
- https://developers.google.com/fit/rest/v1/reference/users/dataset/aggregate
- https://developer.android.com/health-and-fitness/health-connect/comparison-guide
- https://developer.android.com/health-and-fitness/health-connect/migration/fit

## Apple Health

Apple Health nao oferece uma API web publica equivalente ao Google Fit REST. A integracao correta passa por HealthKit em iOS/iPadOS/watchOS, com permissao explicita da pessoa usuaria, e envio autorizado para o backend PRISMA13.

Referencias oficiais:

- https://developer.apple.com/documentation/healthkit
- https://developer.apple.com/documentation/healthkit/about-the-healthkit-framework

## Endpoints

- `GET /api/health-data`
- `POST /api/google-fit/connect`
- `GET /api/google-fit/callback`
- `POST /api/google-fit/sync`
- `POST /api/apple-health/import`

Todos os endpoints de dados, exceto callback OAuth, exigem Firebase ID token.
