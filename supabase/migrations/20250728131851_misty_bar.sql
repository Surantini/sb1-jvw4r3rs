/*
  # Create referrals table

  1. New Tables
    - `referrals`
      - `id` (uuid, primary key)
      - `referrer_id` (uuid, foreign key to users.id)
      - `referee_id` (uuid, foreign key to users.id)
      - `txr_earned` (text) - TxR tokens earned by referrer
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `referrals` table
    - Add policy for users to read referrals where they are the referrer
    - Add policy for users to insert referral records
*/

CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  txr_earned text NOT NULL DEFAULT '0',
  created_at timestamptz DEFAULT now(),
  UNIQUE(referrer_id, referee_id)
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their referral data"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (
    referrer_id IN (
      SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'wallet_address'
    ) OR
    referee_id IN (
      SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'wallet_address'
    )
  );

CREATE POLICY "Users can insert referral data"
  ON referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_id ON referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at DESC);