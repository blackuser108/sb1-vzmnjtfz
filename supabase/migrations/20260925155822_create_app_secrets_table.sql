/*
# Create app_secrets table for storing API keys

1. New Tables
- `app_secrets`: stores sensitive API keys/secrets that edge functions need
  - `key` (text, primary key): the secret name
  - `value` (text, not null): the secret value
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- RLS enabled on app_secrets
- NO policies created — only the service role (which bypasses RLS) can read/write
- The anon and authenticated roles cannot access any rows
*/

CREATE TABLE IF NOT EXISTS app_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_secrets ENABLE ROW LEVEL SECURITY;
