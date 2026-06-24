# CHECKPOINT OFICIAL FIREBASE - PRISMAS

## Versao oficial restaurada

- Data/hora de referencia solicitada: 23/06/2026 11:00 BRT.
- Firebase Hosting release ativa nesse horario: `2026-06-23T08:54:34.258Z`.
- Firebase Hosting version: `sites/prisma13-e339b/versions/e416b61f49b1b891`.
- File count da versao restaurada: 746 arquivos.
- URL oficial/provisoria: `https://prisma13-e339b.web.app/`.

## Incidente corrigido

- Deploy indevido: `2026-06-24T09:04:21.469Z`.
- Version indevida: `sites/prisma13-e339b/versions/2939c9ffadb0168b`.
- Origem do erro: uso do branch `codex/sampa-demo-retomada` como se fosse base oficial.
- Primeira correcao aplicada: rollback Firebase Hosting em `2026-06-24T09:45:07.636Z` para `add281e8921bc38b`.
- Correcao final solicitada: rollback Firebase Hosting em `2026-06-24T10:32:43.204Z`.
- Release atual apos correcao final: `ROLLBACK` para `e416b61f49b1b891`.

## Contas Google/Firebase

- Conta Firebase CLI com acesso ao projeto: `olairjr@gmail.com`.
- Conta vista no Console durante a discrepancia: `consultasdrolair@gmail.com`.
- Regra: antes de operar Firebase Console, confirmar visualmente que a conta ativa e `olairjr@gmail.com` ou que a conta ativa tem permissao formal no projeto.

## Regra operacional

Persistir no erro e burrice.

Antes de qualquer novo deploy oficial:

1. Confirmar que a base local corresponde a versao restaurada ativa em 23/06/2026 11:00 BRT.
2. Confirmar branch, commit, Firebase project e conta ativa.
3. Confirmar que `public` corresponde ao artefato completo esperado, nao ao branch demo.
4. Validar URL local e URL Firebase com cache limpo.
5. Publicar somente depois de checkpoint protegido.

## Proibicoes ate nova ordem

- Nao usar `codex/sampa-demo-retomada` como base oficial.
- Nao publicar demo em `live`.
- Nao fazer deploy oficial a partir de branch sem correspondencia com a release `e416b61f49b1b891`.
- Nao confundir limpeza de identidade publica com substituicao da versao completa.
