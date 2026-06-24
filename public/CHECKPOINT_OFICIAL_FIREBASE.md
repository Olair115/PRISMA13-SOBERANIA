# CHECKPOINT OFICIAL FIREBASE - PRISMAS

## Versao oficial restaurada

- Data/hora de referencia: 23/06/2026 12:03 BRT.
- Firebase Hosting release original: `2026-06-23T15:03:01.625Z`.
- Firebase Hosting version: `sites/prisma13-e339b/versions/add281e8921bc38b`.
- File count da versao restaurada: 757 arquivos.
- URL oficial/provisoria: `https://prisma13-e339b.web.app/`.

## Incidente corrigido

- Deploy indevido: `2026-06-24T09:04:21.469Z`.
- Version indevida: `sites/prisma13-e339b/versions/2939c9ffadb0168b`.
- Origem do erro: uso do branch `codex/sampa-demo-retomada` como se fosse base oficial.
- Correcao aplicada: rollback Firebase Hosting em `2026-06-24T09:45:07.636Z`.
- Release atual apos correcao: `ROLLBACK` para `add281e8921bc38b`.

## Contas Google/Firebase

- Conta Firebase CLI com acesso ao projeto: `olairjr@gmail.com`.
- Conta vista no Console durante a discrepancia: `consultasdrolair@gmail.com`.
- Regra: antes de operar Firebase Console, confirmar visualmente que a conta ativa e `olairjr@gmail.com` ou que a conta ativa tem permissao formal no projeto.

## Regra operacional

Persistir no erro e burrice.

Antes de qualquer novo deploy oficial:

1. Confirmar que a base local corresponde a versao completa restaurada de 23/06/2026 12:03 BRT.
2. Confirmar branch, commit, Firebase project e conta ativa.
3. Confirmar que `public` corresponde ao artefato completo esperado, nao ao branch demo.
4. Validar URL local e URL Firebase com cache limpo.
5. Publicar somente depois de checkpoint protegido.

## Proibicoes ate nova ordem

- Nao usar `codex/sampa-demo-retomada` como base oficial.
- Nao publicar demo em `live`.
- Nao fazer deploy oficial a partir de branch sem correspondencia com a release `add281e8921bc38b`.
- Nao confundir limpeza de identidade publica com substituicao da versao completa.

