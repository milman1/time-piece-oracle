-- Schedule price alert checks daily at 5 AM UTC (right after the scraper runs at 4 AM)
-- This ensures we're checking against fresh price data

SELECT cron.schedule(
  'daily-price-alert-check',
  '0 5 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/send-price-alerts',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
