-- Add 'void' status to transactions status CHECK constraint
ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS transactions_status_check;

ALTER TABLE transactions
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pending', 'processing', 'successful', 'failed', 'reversed', 'void'));

