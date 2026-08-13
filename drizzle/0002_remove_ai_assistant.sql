DO $$
DECLARE
  function_record record;
BEGIN
  FOR function_record IN
    SELECT oid::regprocedure AS signature
    FROM pg_proc
    WHERE proname = 'match_knowledge_documents'
      AND pronamespace = 'public'::regnamespace
  LOOP
    EXECUTE format('DROP FUNCTION %s', function_record.signature);
  END LOOP;
END $$;

DROP TABLE IF EXISTS "knowledge_documents";
