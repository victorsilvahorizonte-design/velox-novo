# VeloX — Relatório de atualização

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
- O modelo existente por vínculo foi preservado: cada readmissão continua criando um novo registro, histórico e conjunto de pastas, mantendo o vínculo com o registro anterior.
- A interface também traduz os nomes por ID para registros existentes, sem depender do texto antigo salvo.
- As categorias de saúde ocupacional e vacinação são marcadas como `sensitive` no catálogo. Isso é metadado para orientar controles futuros; não altera a autorização atual nem cria permissões que ainda não existem.
- A migration `supabase/migrations/20261107_002_taxonomia_documental.sql` está preparada, mas NÃO foi executada. Ela renomeia somente as pastas de categoria no snapshot ativo por ID, preservando IDs, documentos, links e históricos de recuperação. Aplicar apenas depois de backup e homologação no projeto Supabase correto.

### Validação desta entrega

- `npm test`: 33/33 testes aprovados.
- `npm run test:preflight`: 10 testes aprovados e 1 teste condicional; após gerar as páginas de produção, 11/11 testes aprovados.
- Sintaxe TypeScript de `index.ts` e `rules.ts` aprovada.
- Sintaxe dos scripts JavaScript e scripts embutidos nas páginas aprovada; CSS das páginas analisado sem erros de sintaxe.
- Gerador de páginas de produção sincronizado com o login atual e atualizado para copiar todos os assets públicos. Geração de `production-src/` executada com sucesso.
- Backup criptografado e verificação de integridade aprovados.
- A compilação Vite não foi executada neste ambiente porque as dependências do projeto não estão instaladas aqui. Execute no StackBlitz após copiar os arquivos: `npm install`, `npm run test`, `npm run test:preflight` e `npm run build:producao`.
- A conferência visual final em dispositivos e níveis de zoom reais continua sendo feita pelo usuário no StackBlitz.

**Não realizado:** nenhum deploy Cloudflare, nenhuma migration Supabase, nenhuma alteração em dados reais ou arquivos de colaboradores.


## Histórico da internacionalização — 07/11/2026 (substituído em 08/11)

- O pacote anterior tinha 8 idiomas: Português (Brasil), Inglês, Espanhol, Francês, Alemão, Italiano, Chinês simplificado e Japonês.
- Catálogo central com **939 textos e rótulos**, cada um com tradução preenchida para os 7 idiomas de destino.
- Cobertura ampliada para login, navegação, formulários, opções de RH/DP, gestão contratual, recebimento documental, calendários, tooltips, mensagens, filtros, alertas, estados de tabelas e relatórios.
- Datas, horários, moedas e nomes de países recebem formatação/localização compatível com o idioma.
- Conteúdo digitado pelo usuário, nomes de colaboradores, dados pessoais, nomes de equipes/centros de custo/categorias e arquivos permanecem preservados. Sugestões de países exibem o nome localizado, mas gravam o nome canônico.
- Logo e identidade da marca permanecem inalteradas.
- Exportações PDF e Excel recebem títulos, colunas, filtros, rodapés e formatação de datas localizados. **Limitação conhecida:** o PDF com Chinês/Japonês é bloqueado com orientação para exportar em Excel, pois a fonte PDF incorporada não contém esses glifos; o XLSX preserva esses idiomas.
- Regra para novas funcionalidades: todo texto novo de interface deve ser incluído no catálogo `i18n.js` nos sete idiomas, e coberto por teste automatizado antes da entrega.

### Validação desta atualização

- `npm test`: **40/40 aprovados**.
- `npm run prepare:uso-real`: páginas de produção geradas em área isolada; originais preservados.
- `npm run test:preflight`: **11/11 aprovados**.
- Sintaxe do módulo `i18n.js` e dos 16 scripts inline de `app.html`: aprovada.
- Nenhuma publicação foi realizada.



## Redução permanente do seletor de idiomas — 08/11/2026

- Idiomas mantidos: **português (PT), inglês (EN), espanhol (ES) e francês (FR)**.
- Removidos do código ativo: **alemão, italiano, chinês simplificado e japonês**; seus rótulos, traduções, bandeiras e caminhos de localização não são incluídos no pacote atual.
- Preservados: o desenho aprovado, as bandeiras animadas 3D dos quatro idiomas, a logo, os dados empresariais e as funcionalidades existentes.
- Preferências salvas de idiomas removidos são normalizadas para PT, evitando seleções inválidas.
- Dicionários revisados e testes automatizados ajustados para exigir exatamente quatro idiomas e nenhuma referência de idioma desativado.
- Catálogo vigente: **938 rótulos de interface com EN, ES e FR** (a antiga mensagem exclusiva para chinês/japonês foi eliminada).
- `npm test`: **41/41 aprovados**; `npm run test:preflight`: **11/11 aprovados**; páginas de produção geradas.
- A entrega continua no Drive, sem atualização do StackBlitz ou publicação de produção por esta operação.
