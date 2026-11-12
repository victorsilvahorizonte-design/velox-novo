# WhatsApp — homologação VELOX

Projeto Supabase: lvcqognweiqlybaifckg, São Paulo. App Meta: 4632676697055696.

11/11/2026: tabela velox_wa_test_inbox instalada com RLS, sem acesso de anon/authenticated. Função velox-whatsapp-webhook publicada com verificação JWT DESATIVADA somente nesta função, autorizada pelo proprietário em 11/11/2026. Código e 12 testes em tests/whatsapp-webhook.test.cjs; executar node tests/whatsapp-webhook.test.cjs.

Não há integração ativa com o módulo local de jornadas. Não envia mensagens e não registra ponto oficial. Somente PONTO de remetentes explicitamente autorizados será armazenado. Horário original da Meta e horário de recebimento no banco são distintos.

Secrets necessários no Supabase: WA_APP_SECRET (segredo do app Meta), WA_VERIFY_TOKEN (valor aleatório criado pelo proprietário para o handshake), WA_EXPECTED_WABA_ID, WA_EXPECTED_PHONE_NUMBER_ID e WA_TEST_SENDERS (remetentes separados por vírgula, exatamente como enviados pela Meta). Nunca gravar seus valores no código ou no StackBlitz.

Após configuração e validação: confirmar mudança da autenticação de JWT para assinatura HMAC-SHA256 somente nesta função, verificar callback na Meta e assinar messages. JWT de velox-api deve permanecer habilitado. Antes de receber dados reais, cumprir publicação exigida pela Meta e concluir autorização/homologação.

Concluído: cinco secrets cadastrados no Supabase, callback verificado e salvo pela Meta, evento messages assinado automaticamente em v27.0. Remetente de homologação autorizado: 5562991576201. Nenhuma mensagem real processada.

Faltam: validação remota de persistência com mensagem autorizada, vínculo/registro do número na Cloud API, confirmação de coexistência para o número empresarial, vinculação autenticada ao cadastro de colaboradores e ao módulo de ponto. Não migrar número existente sem revisar o impacto no WhatsApp Business.

11/11/2026: Meta bloqueou reivindicação do número gratuito de teste por verificação de novo dispositivo/localização. Business Home exige chave de acesso; nenhuma alternativa visível. Número de teste não foi criado. Número empresarial não foi migrado.

11/11/2026: número de teste Meta +1 (555) 176-0974 criado pelo proprietário. WABA de homologação 935317202846152; phone_number_id 1368448553029480. Secrets de escopo atualizados para esses IDs. Destinatário +55 (62) 99157-6201 confirmado na Meta. Aguardando teste de recebimento de PONTO; token de envio não gerado e nenhuma resposta automática configurada.
