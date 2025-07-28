/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `tx_hash` (text, unique)
      - `tx_type` (text) - lend, borrow, withdraw, referral, reward
      - `asset` (text) - BNB, USDT, BTCB, ETH, TxR
      - `amount` (text) - stored as string to preserve precision
      - `txr_earned` (text) - TxR tokens earned from this transaction
      - `status` (text, default 'pending') - pending, confirmed, failed
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policy for users to read their own transactions
    - Add policy for users to insert their own transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tx_hash text UNIQUE NOT NULL,
  tx_type text NOT NULL CHECK (tx_type IN ('lend', 'borrow', 'withdraw', 'referral', 'reward', 'repay')),
  asset text NOT NULL,
  amount text NOT NULL,
  txr_earned text NOT NULL DEFAULT '0',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  ));

CREATE POLICY "Users can insert their own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'wallet_address'
  ));

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_type ON transactions(tx_type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);