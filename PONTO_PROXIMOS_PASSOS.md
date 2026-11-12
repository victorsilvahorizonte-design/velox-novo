# VELOX Ponto próprio — versão de desenvolvimento 0.1

O módulo está integrado ao menu Jornadas e Ponto do projeto Velox Sistemas de Gestão 1.0.
Não usa fornecedores de ponto ou licenças desses fornecedores. Não há integração ativa com WhatsApp nem substituição do controle oficial.

## Implementado nesta versão

- Motor independente de marcações: quatro tipos de batida, sem limite diário de quatro registros.
- Palavra PONTO normalizada; mensagens comuns não criam registros; repetição técnica de mensagem é idempotente.
- Cadastro de pessoas do laboratório, opcionalmente vinculado ao cadastro do VELOX; um telefone por vínculo.
- Jornadas com data de vigência, sem preencher horários de ponto automaticamente.
- Original preservado pelas operações do módulo. Ajustes adicionais, decisão e motivo ficam separados.
- Hash SHA-256 e encadeamento demonstrativo dos registros. Isso não equivale a armazenamento imutável certificado.
- Relógio com segundos no coletor de teste; utiliza relógio local, sem comprovação de HLB.
- Apuração bruta por sessão; jornadas atravessando a meia-noite são atribuídas ao dia de entrada.
- Fechamento de teste com snapshot, versionamento e reabertura com justificativa.
- Espelho mensal em PDF de teste, gerado localmente com pdf-lib; sem assinatura qualificada.
- Interface própria em português, inglês, espanhol e francês.
- Exportação JSON do laboratório.

## Limites de segurança e validade

O laboratório usa exclusivamente localStorage com chave própria, sem alterar a base de Pessoas. Navegador limpo ou outro dispositivo não compartilha esses registros. DevTools pode modificar essa base. Os documentos são identificados como testes e não possuem assinatura ICP-Brasil. Nenhum AFD/AEJ fiscal é anunciado como disponível. A tela fica bloqueada fora do ambiente de demonstração atual.

Sem cálculo de folha, tolerâncias legais, adicional noturno, hora noturna reduzida, banco de horas, regras coletivas ou deduções automáticas. Uma justificativa de dia não concede automaticamente horas remuneradas. Jornada noturna ou complexa deve ser conferida.

O motor é uma biblioteca para ser executada também no servidor. Não expor ações administrativas como aprovação, vínculo de telefone ou exportação ao usuário empregado. Em produção, o ator deve vir da sessão autenticada, nunca do corpo do pedido.

## Próxima etapa: serviço próprio e operação real

1. Criar tabelas transacionais próprias para eventos, sessões de coleta, vigências, decisões e comprovantes. Não usar o snapshot mutável atual do ERP como ARP oficial.
2. Identificação individual: vincular conta autenticada ao vínculo e ao empregador; autenticação adicional ao telefone. Autorizar cada operação por empresa, vínculo e papel.
3. Registro com data e hora do servidor e fuso. Monitorar sincronismo com HLB e indisponibilidades. Proteger originais no banco, armazenamento independente e recuperação testada. Implantar NSR de acordo com as operações e estabelecimento exigidos na norma, não confundir com a sequência de teste desta versão.
4. Implantar coletor móvel autenticado e comprovante legal com geração e assinatura PAdES, gestão segura dos certificados, NSR e campos regulamentares. Registrar o programa no INPI e emitir o atestado técnico aplicável.
5. Implementar AFD e AEJ a partir dos leiautes oficiais vigentes, com vetores de teste, assinatura e validação independentes. Fonte oficial: https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/fiscalizacao-do-trabalho/rep
6. Conectar diretamente a conta WhatsApp Business da VELOX à Cloud API da Meta, sem provedor intermediário de ponto. As mensagens de PONTO apenas abrem o coletor; confirmar nele efetiva a marcação. Usar webhook com validação HMAC sobre corpo bruto, fila durável, deduplicação por mensagem, expiração de sessão e outbox para envio confiável. Não incluir CPF ou token de administração em mensagens/URLs. Não usar automação de WhatsApp Web.
7. Definir tabela de escalas completas, feriados, instrumentos coletivos e regras de apuração versionadas. Revisão por responsável de RH/DP antes de integrar folha.
8. Homologar autenticação, perda de rede, relógio, duplicidade, sequência, virada de dia/mês, volume simultâneo, assinaturas, auditoria e restauração. Validar a conformidade antes de substituir o serviço atual.

## Insumos ainda necessários

- Número empresarial da VELOX que será conectado à Meta e acesso administrativo à conta Business.
- Ambiente de servidor/banco de homologação e domínio HTTPS.
- Responsável técnico/legal, registro INPI e certificado apropriado para assinaturas.
- Escalas, regras coletivas e critérios validados para o cálculo oficial.

Credenciais privadas não devem ser colocadas no projeto StackBlitz nem enviadas no chat. Configurar somente no cofre do servidor. Custos de hospedagem, certificado e mensagens Meta podem existir; não há promessa de operação gratuita.

## Testes

`npm run test:timeclock` executa testes de domínio e dos quatro idiomas. `npm test` também os inclui. Não são testes de conformidade legal nem substituem testes de banco e produção.


## Cadastro único de colaboradores — implementado em 11/11/2026

- Pessoas > Nova pessoa ou Editar perfil > Situação do trabalho > Ponto por WhatsApp.
- WhatsApp autorizado, matrícula, admissão, unidade, habilitação e sete dias da jornada ficam no mesmo registro Pessoas.
- Ao habilitar, os campos vazios reaproveitam celular e admissão informados no formulário. Há atalho para jornada de 44 horas, sem gerar marcações.
- Pessoas > Importar CSV: modelo para download, prévia obrigatória, máximo de 100 novos vínculos e 200 KB; unidades devem existir. Matrícula obrigatória; não atualiza pessoas existentes.
- Lote grava pela ação autenticada people.import; falha em qualquer linha não persiste o lote. Repetir a mesma chave de operação não duplica.
- Regras de matrícula, telefone habilitado único e jornada valem também no serviço Supabase (fonte rules.ts).
- O laboratório de ponto reaproveita Pessoas ao abrir Jornadas e Ponto. Alterações de telefone/jornada preservam eventos originais e revisões anteriores.
- Situação atual: cadastro único implementado e API velox-api publicada no Supabase. Banco privado e controle de revisão validados. Ainda faltam conta administrativa autorizada, domínio HTTPS do aplicativo e conexão efetiva do coletor de ponto à Meta. O módulo de ponto continua em laboratório e não é ponto oficial. Nenhum dado real foi usado nos testes.


## Validação de continuidade — 12/11/2026

- `npm test` agora inclui `backend.test.mjs`, além dos testes do sistema e do ponto.
- `npm run test:backend` executa somente os testes do serviço.
- `npm run check:producao` aprovado com a validação do backend incluída e compilação de produção concluída.
- Velox Financeiro fica fora desta entrega. O repositório velox-novo contém uma aplicação React ligada ao Firebase velox-inspecao-anac; não deve substituir automaticamente a versão atual deste StackBlitz.
- A publicação e o uso real do ponto permanecem pendentes; o resultado dos testes não equivale à entrega de mensagens WhatsApp ou homologação de ponto.
