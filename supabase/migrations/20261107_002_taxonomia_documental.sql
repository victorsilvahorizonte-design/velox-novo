-- VeloX | Taxonomia documental profissional (11 melhorias)
-- PREPARAÇÃO: aplicar somente após backup e homologação no projeto Supabase correto.
-- Atualiza exclusivamente o nome de pastas de categoria em snapshots ativos.
-- Preserva IDs, categoria numérica, vínculos, documentos, arquivos e históricos de recuperação.
BEGIN;

UPDATE public.velox_snapshots AS snapshot
SET state = jsonb_set(
  snapshot.state,
  '{Pastas}',
  COALESCE((
    SELECT jsonb_agg(
      CASE
        WHEN jsonb_typeof(folder) = 'object'
         AND (folder->>'categoria') ~ '^[0-9]+$'
         AND (folder->>'categoria')::integer BETWEEN 1 AND 14
        THEN jsonb_set(
          folder,
          '{nome}',
          to_jsonb(CASE (folder->>'categoria')::integer
            WHEN 1 THEN 'Documentos de Identificação'
            WHEN 2 THEN 'Comprovantes de Residência'
            WHEN 3 THEN 'Carteira de Trabalho (CTPS)'
            WHEN 4 THEN 'Admissão e Contrato de Trabalho'
            WHEN 5 THEN 'Saúde Ocupacional (ASO e Exames)'
            WHEN 6 THEN 'Registros de Vacinação'
            WHEN 7 THEN 'Dependentes'
            WHEN 8 THEN 'Equipamentos de Proteção Individual (EPI)'
            WHEN 9 THEN 'Jornada e Frequência'
            WHEN 10 THEN 'Demonstrativos de Pagamento (Holerites)'
            WHEN 11 THEN 'Comprovantes de Pagamento Salarial'
            WHEN 12 THEN 'Férias'
            WHEN 13 THEN '13º Salário'
            WHEN 14 THEN 'Desligamento e Rescisão Contratual'
          END),
          true
        )
        ELSE folder
      END
      ORDER BY ordinal
    )
    FROM jsonb_array_elements(COALESCE(snapshot.state->'Pastas','[]'::jsonb)) WITH ORDINALITY AS item(folder,ordinal)
  ), '[]'::jsonb),
  true
),
revision = snapshot.revision + 1,
changed_at = now()
WHERE jsonb_typeof(snapshot.state->'Pastas') = 'array'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(snapshot.state->'Pastas') AS item(folder)
    WHERE jsonb_typeof(folder) = 'object'
      AND (folder->>'categoria') ~ '^[0-9]+$'
      AND (folder->>'categoria')::integer BETWEEN 1 AND 14
  );

COMMIT;
