-- VeloX | fundação privada. APLICAR SOMENTE EM PROJETO SUPABASE EXCLUSIVO.
-- Princípio: ninguém acessa tabelas ou Storage pelo navegador; apenas a Edge Function autenticada.
-- NUNCA inserir CPFs e senhas em comandos de instalação ou repositórios.
BEGIN;

CREATE TABLE IF NOT EXISTS public.velox_owners (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
  active boolean NOT NULL DEFAULT true,
  added_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.velox_snapshots (
  owner_id uuid PRIMARY KEY REFERENCES public.velox_owners(user_id) ON DELETE RESTRICT,
  revision bigint NOT NULL DEFAULT 0 CHECK (revision >= 0),
  state jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(state) = 'object'),
  changed_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.velox_daily_recovery (
  owner_id uuid NOT NULL REFERENCES public.velox_owners(user_id) ON DELETE RESTRICT,
  backup_day date NOT NULL,
  revision bigint NOT NULL,
  state jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (owner_id, backup_day)
);

-- Sem políticas para anon/authenticated: bloqueio total de acesso direto.
ALTER TABLE public.velox_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.velox_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.velox_daily_recovery ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.velox_owners, public.velox_snapshots, public.velox_daily_recovery FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.velox_owners, public.velox_snapshots, public.velox_daily_recovery TO service_role;

CREATE OR REPLACE FUNCTION public.velox_cas_write(
  p_owner uuid, p_expected bigint, p_state jsonb
) RETURNS bigint
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public
AS $$
DECLARE current_rev bigint;
BEGIN
  IF jsonb_typeof(p_state) IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'INVALID_STATE' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS(SELECT 1 FROM public.velox_owners WHERE user_id = p_owner AND active) THEN
    RAISE EXCEPTION 'OWNER_NOT_ACTIVE' USING ERRCODE = '42501';
  END IF;
  -- Mantém a primeira cópia do dia anterior à próxima alteração.
  INSERT INTO public.velox_daily_recovery(owner_id, backup_day, revision, state)
    SELECT owner_id, current_date, revision, state
    FROM public.velox_snapshots
    WHERE owner_id = p_owner AND revision = p_expected
  ON CONFLICT(owner_id, backup_day) DO NOTHING;
  UPDATE public.velox_snapshots
    SET state = p_state, revision = revision + 1, changed_at = now()
    WHERE owner_id = p_owner AND revision = p_expected
    RETURNING revision INTO current_rev;
  IF current_rev IS NULL THEN
    RAISE EXCEPTION 'REVISION_CONFLICT' USING ERRCODE = '40001';
  END IF;
  RETURN current_rev;
END;
$$;
REVOKE ALL ON FUNCTION public.velox_cas_write(uuid,bigint,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.velox_cas_write(uuid,bigint,jsonb) TO service_role;

-- Após criar um usuário em Authentication, vincular EXCLUSIVAMENTE o UUID dele:
-- INSERT INTO public.velox_owners (user_id) VALUES ('UUID-AUTENTICADO-AQUI');
-- INSERT INTO public.velox_snapshots (owner_id, state) VALUES ('MESMO-UUID-AQUI','{}'::jsonb);
-- Configurar Storage com bucket velox-private, acesso NÃO público.
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
  VALUES ('velox-private','velox-private',false,8388608,null)
ON CONFLICT(id) DO UPDATE SET public = false, file_size_limit = 8388608;
-- Não criar policies em storage.objects; leitura/gravação apenas via service_role no servidor.
-- Origens do aplicativo autorizadas pelo administrador; nenhuma origem liberada por padrão.
CREATE TABLE IF NOT EXISTS public.velox_app_origins(
 origin text PRIMARY KEY CHECK (origin ~ '^https://[a-z0-9.-]+(:[0-9]{1,5})?$'),
 active boolean NOT NULL DEFAULT true,
 added_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.velox_app_origins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.velox_app_origins FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.velox_app_origins TO service_role;
COMMENT ON TABLE public.velox_app_origins IS 'Origens HTTPS exatas do frontend. Sem acesso direto dos clientes. Nenhum wildcard.';
-- A função de evento criada pelo painel não é uma API pública.
DO $permissions$
BEGIN
 IF to_regprocedure('public.rls_auto_enable()') IS NOT NULL THEN
  REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC,anon,authenticated;
 END IF;
END $permissions$;
COMMIT;
