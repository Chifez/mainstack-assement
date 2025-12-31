-- Update amount column to support multi-currency with higher precision
-- DECIMAL(20, 8) supports:
-- - Standard fiat currencies (2 decimals): USD, EUR, GBP, NGN
-- - No-decimal currencies (0 decimals): JPY, KRW
-- - Cryptocurrencies (up to 8 decimals): BTC, ETH
ALTER TABLE transactions 
ALTER COLUMN amount TYPE DECIMAL(20, 8);


