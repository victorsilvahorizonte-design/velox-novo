# VeloX — Sistema de Gestão | Projeto único

**Projeto:** desenvolvimento no StackBlitz, produção no Cloudflare Pages, dados privados no Supabase (PostgreSQL + Auth + Storage). **Uso com dados reais bloqueado até a homologação.**

## O que está preservado

- `index.html` e `app.html` continuam sendo as telas aprovadas para desenvolvimento, com seus respectivos arquivos e seletor de quatro idiomas.
- A versão de publicação é **gerada automaticamente do mesmo projeto**, não é um segundo sistema. `npm run build:producao` gera `dist-uso-real/` e exclui o login demonstrativo e `demo-bridge.js`.
- Sem dependência do Google Drive na versão publicada. O Drive é somente o local atual de transferência do código-fonte.

## Comandos no StackBlitz (terminal do projeto)

```bash
npm install
npm run test
npm run test:preflight
npm run build:producao
npm run preview:producao
```

**Configuração obrigatória da compilação:** criar `.env.production` na raiz, preenchendo SOMENTE as duas variáveis públicas a seguir, fornecidas pelo projeto Supabase real:

```dotenv
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=COLE_APENAS_CHAVE_PUBLICAVEL
```

O arquivo `.env.production` é ignorado pelo Git e não deve ser publicado. **Nunca colocar service_role, senha, token de acesso, secret key nem senha do banco no StackBlitz/Drive/HTML.** Não usar dados pessoais reais no ambiente de desenvolvimento.

## Publicação inicial gratuita

- **Cloudflare Pages:** é o host do VeloX; depois de validar o build, fazer Direct Upload do conteúdo de `dist-uso-real/` para um projeto Pages. Isso cria um endereço `*.pages.dev` gratuito e com HTTPS. O Direct Upload não permite trocar o mesmo projeto para integração Git posteriormente; para atualizar, continuar usando upload ou Wrangler.
- **Supabase:** criar projeto gratuito PostgreSQL de propriedade do usuário, com Auth e bucket privado. Executar SQL `supabase/migrations/20261105_001_seguro.sql`; criar no Auth o usuário proprietário; registrar seu UUID no banco como indicado no SQL; publicar a função `supabase/functions/velox-api/index.ts` com as regras `rules.ts` e validação de JWT habilitada.
- Configurar `VELOX_ALLOWED_ORIGINS` **somente** para o endereço HTTPS final do VeloX, sem barras finais, como variável privada da função.
- Desativar registro público de novos usuários e autorizar apenas o proprietário. Configurar corretamente a política de autenticação e dados pessoais antes de qualquer inserção real.
- Todos os dados e arquivos ficam no Supabase, não na Cloudflare nem no StackBlitz.

## Proteções já implementadas no código

- Login real via Supabase Auth; apenas usuário autorizado na tabela `velox_owners` acessa a API.
- Backend centralizado em Edge Function com escopo por UUID, validação do JWT e verificação de origem; não expõe a service_role ao navegador.
- PostgreSQL com RLS e atualização de snapshot com controle de revisão; Storage privado (`velox-private`).
- Anexos enviados via API com máximo técnico conservador de **5 MB por arquivo** nesta versão; arquivos maiores exigem fluxo de upload direto autenticado antes de serem liberados.
- Script de exportação criptografada inclui cadastro e documentos, e o verificador confere a integridade do arquivo (`backup/`). A restauração foi exercitada localmente com dados fictícios. A verificação remota depende de um projeto isolado.

## Backup e restauração

Execute os comandos em uma máquina confiável. Configure a chave administrativa e a senha do backup apenas como variáveis de ambiente locais, com a senha guardada separadamente dos arquivos.

- Exportar: defina `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VELOX_OWNER_UUID`, `VELOX_BACKUP_PASSPHRASE` e `VELOX_BACKUP_DIR`. Execute `node backup/export.mjs`. Use como destino uma pasta externa ao Supabase com acesso restrito.
- Verificar: execute `node backup/verify.mjs CAMINHO_DO_BACKUP` com a mesma senha.
- Restaurar para homologação: aplique a migração em outro projeto, autorize um usuário de teste em `velox_owners` e deixe o banco sem snapshots e o bucket vazio. Defina `VELOX_RESTORE_URL`, `VELOX_RESTORE_SECRET`, `VELOX_RESTORE_OWNER` e a senha. Execute `node backup/restore.mjs CAMINHO_DO_BACKUP`. Para backups anteriores ao registro do projeto de origem, defina também `VELOX_BACKUP_SOURCE_URL`. O script confere o snapshot e o SHA-256 de cada arquivo restaurado. Aceita backups de até 128 MiB. Se interrompido, confira o destino isolado antes de repetir.

## Estado da implantação — projeto lvcqognweiqlybaifckg

- Em 12/11/2026, fundação privada e bucket velox-private aplicados pelo conector Supabase. API velox-api versão 1 ativa com verificação de JWT habilitada.
- O projeto Auth está sem usuários e sem proprietário autorizado. Não existe liberação automática de novas contas. Ainda precisamos definir o e-mail administrativo, concluir seu acesso e vincular o UUID explicitamente.
- Nenhuma origem HTTPS do frontend foi autorizada. O endereço publicado deve ser confirmado antes da inclusão em velox_app_origins. O código também aceita VELOX_ALLOWED_ORIGINS quando configurado no servidor.
- A compilação está configurada com a URL deste Supabase e apenas sua chave publicável. Credenciais administrativas permanecem exclusivamente no ambiente da função.
- A existência de um deploy Cloudflare anterior não foi confirmada nesta conta. Nenhum novo deploy Cloudflare foi realizado nesta ativação.
- Não inserir dados reais até validar o login administrativo e a persistência pelo endereço final. O coletor de ponto ainda permanece em laboratório.

## Atualização visual e funcional — pacote de 11 melhorias

Esta entrega foi preparada como uma nova versão independente. A pasta de origem `01 — ARRASTAR NO STACKBLITZ` permanece intacta. O pacote atualizado mantém a mesma arquitetura (StackBlitz para desenvolvimento, Cloudflare Pages para publicação e Supabase para dados), sem publicar ou alterar o ambiente de produção.

### O que foi preparado

1. Login sem moldura, barra de status, ilha ou detalhes fictícios de dispositivo; preserva marca, animação 3D e adaptação real de tela.
2. Camada responsiva revisada para celular, tablet, notebook, monitor, ultrawide, zoom e telas de alta resolução.
3. Remoção do cursor personalizado verde/dourado e da opção que o ativava; os cursores nativos continuam refletindo cada ação (texto, link, arraste, indisponível etc.).
4. Barras de rolagem mais finas e discretas, com realce suave no hover.
5. Um único componente de idioma para login e sistema interno; preserva bandeiras animadas, mostra siglas PT/EN/ES/FR e mantém nomes completos para acessibilidade.
6. Tooltips unificados no login e em todas as áreas do sistema: um único componente visual do VeloX, sem tooltip nativo duplicado do navegador; compatível com mouse, teclado, quatro idiomas, conteúdo dinâmico e dicas específicas já existentes.
7. Remoção do botão e da janela Meu VeloX/Administração do Sistema, obsoletos na arquitetura atual. A área Acessos externos foi preservada.
8. Catálogo profissional de documentos de RH/DP, com 14 IDs permanentes e seis grupos visuais. As categorias ficam agrupadas na interface, sem criar seis níveis físicos de pastas. Documentos e vínculos não são apagados.
9. Grupos da barra lateral e grupos de categorias documentais podem ser recolhidos; estados ficam salvos por navegador/colaborador.
10. Escala comum de espaçamentos, alturas, larguras e densidade visual para evitar caixas desproporcionais e espaços vazios excessivos.
11. Revisão de escalabilidade gráfica: imagens de marca em WebP de alta resolução (1600 px de largura; marca vertical 1000×933), ícones vetoriais SVG, tipografia vetorial e canvas 3D com renderização por devicePixelRatio (até 3,4, limitada pela GPU).

### Preservação de dados e categorias

- Os IDs das categorias continuam de 1 a 14; não renumerar.
- O catálogo usa nomes profissionais e grupos; o backend cria novas pastas com os nomes atualizados.
- A interface também traduz os nomes por ID para registros existentes, sem depender do texto antigo salvo.
- O modelo atual de RH por vínculo foi preservado: cada contratação/readmissão mantém seu próprio registro, histórico e estrutura documental, ligados pelo identificador do vínculo anterior.
- As categorias de saúde ocupacional e vacinação são marcadas como `sensitive` no catálogo. Isso é metadado para orientar controles futuros; não altera a autorização atual nem cria permissões que ainda não existem.
- A migration `supabase/migrations/20261107_002_taxonomia_documental.sql` está preparada, mas NÃO foi executada. Ela renomeia somente as pastas de categoria no snapshot ativo por ID, preservando IDs, documentos, links e históricos de recuperação. Aplicar apenas depois de backup e homologação no projeto Supabase correto.

### Validação desta entrega

- `npm test`: 33/33 testes aprovados.
- `npm run test:preflight`: 10 testes aprovados e 1 teste condicional; após gerar as páginas de produção, 11/11 testes aprovados.
- Sintaxe TypeScript de `index.ts` e `rules.ts` aprovada.
- Sintaxe dos scripts JavaScript e scripts embutidos nas páginas aprovada; CSS das páginas analisado sem erros de sintaxe.
- O gerador de páginas de produção foi sincronizado com o login atual e agora copia também todos os assets públicos (logos, ícones e favicon). A geração de `production-src/` foi executada com sucesso.
- Backup criptografado e verificação de integridade aprovados.
- A compilação Vite não foi executada neste ambiente porque as dependências do projeto não estão instaladas aqui. Execute no StackBlitz após copiar os arquivos: `npm install`, `npm run test`, `npm run test:preflight` e `npm run build:producao`.
- A conferência visual final em dispositivos e níveis de zoom reais continua sendo feita pelo usuário no StackBlitz.

**Não realizado:** nenhum deploy Cloudflare, nenhuma migration Supabase, nenhuma alteração em dados reais ou arquivos de colaboradores.


## Regra de internacionalização

O VeloX oferece **4 idiomas ativos: PT (português), EN (inglês), ES (espanhol) e FR (francês)**. O catálogo central fica em `i18n.js` e `i18n-extra.js` (somente francês). Toda funcionalidade nova deve cadastrar seus textos nos três idiomas de destino e acrescentar testes em `tests.mjs`. Não traduzir logo, nomes, documentos, dados pessoais nem valores definidos pelo usuário. Datas, moedas, países e mensagens dinâmicas devem usar as funções de `VXI18n` quando aplicável.

A lista de idiomas foi reduzida por solicitação de 08/11/2026. Alemão, italiano, chinês simplificado e japonês foram removidos do seletor, dicionários, configurações e testes do pacote **02 — ARRASTAR NO STACKBLITZ**, e não apenas ocultados. Preferências antigas de idiomas removidos retornam a PT. A animação e as quatro bandeiras aprovadas foram preservadas. Esse ajuste não foi publicado em produção.



## Ativação confirmada neste projeto — 12/11/2026

Projeto Supabase `lvcqognweiqlybaifckg` (São Paulo):
- Fundação privada aplicada: velox_owners, velox_snapshots, velox_daily_recovery e velox_app_origins; RLS habilitado e nenhum acesso direto para anon/authenticated.
- Bucket velox-private criado, não público.
- velox-api versão 1 publicada, com validação de JWT habilitada, validação de usuário pelo Auth e autorização explícita em velox_owners. Webhook existente preservado.
- rules.ts sincronizado com as regras atuais do cadastro único e importação CSV. Estado empresarial adicional preservado. SDK do servidor fixado em 2.119.0.
- Testes: 97 regressões existentes e 8 da API com serviços simulados aprovados. backend.test.mjs usa Node 24 ou o esbuild já disponível no projeto Vite e testa a mesma função publicada sem credenciais reais.
- Verificação remota: acesso sem autenticação rejeitado com HTTP 401; gravação com controle de revisão, recusa de revisão antiga, JSON inválido, proprietário inativo e cópia de recuperação testados em transação revertida. Nenhum colaborador ou usuário fictício permaneceu no banco.
- Auditoria de segurança sem alertas WARN/ERROR após restringir a função de evento rls_auto_enable; informações de RLS sem política são intencionais, pois clientes não acessam as tabelas diretamente.

**Ainda não liberado para uso real:** Authentication está sem usuários; velox_owners e snapshots estão vazios; nenhuma origem do aplicativo foi autorizada. É necessário identificar o e-mail administrativo, concluir o cadastro de acesso, vincular seu UUID como proprietário e autorizar o endereço HTTPS exato do Velox publicado. Não liberar qualquer conta automaticamente.

O frontend deve ser compilado com a URL deste projeto e apenas sua chave publicável. A prévia normal do StackBlitz continua demonstrativa e não deve receber dados pessoais reais. O módulo de marcação de ponto continua em laboratório até a integração própria de produção.
