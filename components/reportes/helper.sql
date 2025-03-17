CREATE OR REPLACE FUNCTION create_daily_reports()
RETURNS void AS
$$
BEGIN
INSERT INTO public.reports (date, user_id)
SELECT
    (now() AT TIME ZONE 'America/Guayaquil')::date,
        id
FROM
    public.users;
END;
$$ LANGUAGE plpgsql;





-- Primero activa la extensión pgcron si aún no está activada
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programa la función para ejecutarse todos los días a la 1 AM (hora del servidor)
SELECT cron.schedule('0 1 * * *', 'SELECT create_daily_reports()');