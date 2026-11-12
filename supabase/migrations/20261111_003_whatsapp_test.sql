begin;
create table if not exists public.velox_wa_test_inbox (
  id uuid primary key default gen_random_uuid(),
  provider_message_id text not null check(length(provider_message_id) between 1 and 512),
  waba_id text not null,
  phone_number_id text not null,
  sender text not null check(sender ~ '^[0-9]{8,15}$'),
  provider_timestamp timestamptz not null,
  received_at timestamptz not null default clock_timestamp(),
  command text not null check(command = 'PONTO'),
  stage text not null default 'test_received' check(stage = 'test_received'),
  unique(phone_number_id, provider_message_id)
);
alter table public.velox_wa_test_inbox enable row level security;
revoke all on table public.velox_wa_test_inbox from public, anon, authenticated;
grant insert, select on table public.velox_wa_test_inbox to service_role;
revoke update, delete, truncate on table public.velox_wa_test_inbox from service_role;
comment on table public.velox_wa_test_inbox is 'Homologacao WhatsApp. Comandos recebidos; nao constitui registro de jornada REP-P. Sem acesso direto de clientes.';
commit;
