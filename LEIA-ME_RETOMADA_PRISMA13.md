# LEIA-ME - Retomada PRISMA13

Este arquivo existe para evitar perda de contexto entre Desktop, MINI, NOTE e conversas diferentes.

## Ponto atual protegido

Branch de retomada no GitHub:

`codex/sampa-demo-retomada`

Tag de retomada:

`sampa-demo-retomada-20260617`

Commits principais:

- `f722e8c` - Frontispício / entrada PRISMA13
- `f7c6029` - Tela 02 / Identificação antropométrica
- `847ec25` - Telas 03 a 06
- `0dc027a` - Documento de retomada demo Sampa

## Documento operacional de retomada

Abrir:

`docs/RETOMADA_DEMO_SAMPA.md`

## Ponto visual onde paramos

Tela 03:

`public/tela03/index.html`

Título visível:

`O Veredito do Território`

Próximo botão:

`Avançar para o Equilíbrio`

## Documentos jurídicos e PUP-DI

Os documentos jurídicos não ficam em `public`, para evitar publicação acidental no deploy.

Pasta correta:

`documentos_privados/juridico_prismas/`

Arquivos principais:

- `CODIGO_DE_ETICA_E_CONDUTA_PUP_DI_PRISMAS_R3.docx`
- `CODIGO_DE_ETICA_E_CONDUTA_PUP_DI_PRISMAS_R3.md`
- `CODIGO_PUP_DI_PRISMAS_R3.docx` (versão anterior preservada)
- `MINUTA_SOL_CNPJ_SAAS_PRISMAS_TERMO_CONFIDENCIALIDADE.docx`

## Regra de ouro

Não procurar documento jurídico dentro de `public`.

`public` é área de site/deploy.

`documentos_privados` é área de documentos sensíveis.

## Régua Padrão PRISMAS

**Enxuto, seguro, bonito, explicável e protegido.**

## Comando para retomar no NOTE

```powershell
git fetch origin
git checkout -B codex/sampa-demo-retomada origin/codex/sampa-demo-retomada
```

Depois abrir:

```text
docs/RETOMADA_DEMO_SAMPA.md
public/tela03/index.html
```

Seeemmpre MelhorrrAndo... NUNKAKABA!
Há braços!
