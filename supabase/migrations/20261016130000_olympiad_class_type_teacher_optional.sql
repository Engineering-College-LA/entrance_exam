-- Olympiad registration now also collects the class language (Russian or
-- Kyrgyz), and teacher info becomes optional (enforced client/edge-function
-- side, not via a not-null constraint).

alter table public.olympiad_registrations
  add column if not exists class_type text;
