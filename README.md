# Velox Sistemas de Gestão 1.0

Versão atual do sistema de gestão desenvolvida no [StackBlitz](https://stackblitz.com/edit/stackblitz-starters-e9rxbitk). Contém cadastro único de colaboradores, documentos, unidades e laboratório de ponto por WhatsApp.

Esta linha de desenvolvimento substitui a estrutura React anterior **somente nesta branch**. O código anterior continua na branch `main-vcp-final-fix` e no histórico Git. Velox Financeiro e a aplicação de inspeção ANAC são projetos separados; não configurar o Firebase deles nesta versão.

## Executar a prévia

Requer Node.js 24 e npm.

```sh
npm ci
npm run dev
```

Abra `http://localhost:5173`. A prévia trabalha com dados locais fictícios. Seu login é demonstrativo e não autentica no Supabase. Não cadastre dados reais nela.

## Verificar a versão

```sh
npm test
npm run test:preflight
npm run check:producao
```

A última verificação também gera e confere a edição de produção. `npm run test:backend` executa apenas os testes da API. Os testes do backend usam banco simulado; não requerem segredos ou acesso ao banco real. Dois testes sintáticos opcionais dependem de TypeScript instalado; a API também é carregada pelos testes do backend em Node.js 24.

## Estrutura

| Caminho | Finalidade |
| --- | --- |
| `index.html`, `app.html` | Telas originais da prévia |
| `core.js`, `management-core.js`, `enterprise-workspace.js` | Cadastro e regras do sistema |
| `timeclock-*` | Motor, interface e PDFs do laboratório de ponto |
| `frontend/` | Autenticação real, cliente da API e geração de produção |
| `supabase/functions/` | API autenticada e webhook da Meta |
| `supabase/migrations/` | Estrutura e restrições do banco |
| `backup/` | Scripts de exportação, verificação e recuperação criptografada |
| `testes/`, `tests/`, `*.test.*`, `tests.mjs` | Verificações automatizadas |
| `assets/`, `src/` | Recursos e módulos auxiliares herdados da cópia original |

`node_modules`, resultados de compilação, arquivos de ambiente e backups de dados não são versionados. Os arquivos `index.uso-real.html`, `app.uso-real.html` e a pasta `production-src` são gerados a partir das telas originais. Não editar essas cópias para implementar mudanças.

## Preparar produção

Crie `.env.production` a partir de `.env.exemplo` e preencha a URL do Supabase e a chave **publishable** do projeto de gestão.

```sh
cp .env.exemplo .env.production
npm run check:producao
```

O resultado publicável fica em `dist-uso-real/`. Nunca publicar a raiz da prévia ou o resultado de `npm run build` para uso real. A configuração ausente mantém o acesso de produção indisponível; uma compilação aprovada não significa que login e dados reais estejam ativados.

O servidor exige JWT validado, proprietário ativo e origem HTTPS exata autorizada. Configurar a conta administrativa e a origem do site antes de testar a operação real. Tokens Meta, chave administrativa, certificados e senha do banco ficam somente no ambiente seguro do servidor. Nenhuma credencial privada deve ser incluída no GitHub, HTML, mensagens ou variáveis `VITE_*`.

Não há deploy automático nesta branch. O workflow de CI apenas testa e compila; não publica o site nem executa migrations.

## Situação do ponto

O cadastro do ponto fica em **Pessoas > Situação do trabalho > Ponto por WhatsApp**. Há importação de CSV com prévia e validação. O laboratório reaproveita esse cadastro e preserva versões de jornada e registros originais.

A operação real pelo WhatsApp permanece pendente de integração completa e testes de envio/recebimento. O laboratório não substitui o controle oficial, não é homologação REP-P e gera documentos de teste sem assinatura qualificada. Consulte [PONTO_PROXIMOS_PASSOS.md](PONTO_PROXIMOS_PASSOS.md), [WHATSAPP_INTEGRACAO.md](WHATSAPP_INTEGRACAO.md) e [LEIA_PRIMEIRO.md](LEIA_PRIMEIRO.md).

## Organização desta importação

Fonte extraída do StackBlitz em 12/11/2026. As imagens `public/assets/velox_brand_*.webp` e o arquivo antigo `src/assets/hero.png` não puderam ser exportados pelo sistema de arquivos do WebContainer. As telas atuais usam suas imagens incorporadas no HTML; a compilação da versão atual foi verificada sem esses arquivos. A página inicial antiga do template Vite em `src/main.js` não é entrada do aplicativo atual.

## Publicação na Vercel

`vercel.json` seleciona `npm run check:producao` e a saída `dist-uso-real`. Importe a branch `velox-gestao-1.0` para um projeto de gestão separado. Não utilizar o projeto financeiro nem o de inspeção. Configure Node.js 24 e as variáveis públicas descritas em `.env.exemplo`; não colocar segredos administrativos na Vercel.

As páginas públicas `privacidade.html` e `exclusao-de-dados.html` são incluídas no build sem login. Os caminhos `/privacidade` e `/exclusao-de-dados` também são atendidos. Após o deploy, verificar as URLs públicas reais antes de cadastrá-las na Meta. A publicação não ativa por si só a coleta de ponto nem o acesso ao banco.
