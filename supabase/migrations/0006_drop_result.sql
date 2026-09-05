-- The "outcome" column already exists (added in 0002_agents_and_outcome.sql,
-- previously unused). This migration retires the old "result" field now that
-- the app writes real values (dropped / no_longer_interested / going_to_sign)
-- to "outcome" instead.
alter table viewings drop column if exists result;
