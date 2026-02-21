-- Daily automated scraping via pg_cron + pg_net
-- Calls the scrape-watches edge function in batch mode once per day at 4:00 AM UTC

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Schedule the batch scrape job (daily at 4 AM UTC)
SELECT cron.schedule(
  'daily-watch-scrape',           -- job name
  '0 4 * * *',                    -- cron expression: 4:00 AM UTC daily
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/scrape-watches',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := '{"batch": true}'::jsonb
  );
  $$
);

-- To verify the job was created:
-- SELECT * FROM cron.job;

-- To check job run history:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- To unschedule if needed:
-- SELECT cron.unschedule('daily-watch-scrape');
