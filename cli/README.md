# Virtual Curve CLI

Command-line interface for interacting with the Virtual Curve SDK.

## Installation

```bash
npm install -g @virtual-curve/cli
```

## Configuration

You can configure the CLI using environment variables in a `.env` file:

```bash
# Authority keypair as array of numbers
AUTHORITY_KEYPAIR=[1,2,3,...]
```

## Example Commands

### Using environment variables:
```bash
AUTHORITY_KEYPAIR='[67,67,206,67,112,202,2,22,172,47,124,243,173,235,140,147,123,8,189,100,45,243,70,91,98,67,177,158,187,201,73,167,124,122,239,0,1,65,160,138,128,55,136,30,240,107,147,11,12,132,59,158,206,18,92,148,160,240,197,121,80,135,21,154]' yarn cli create-config --quote-mint TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA --fee 0.3
```

### Using keypair file:
```bash
yarn cli create-config --authority keypairs/authority.json --quote-mint TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA --fee 0.3
```

### Create Configuration

Creates a new Virtual Curve configuration.

```bash
vc create-config \
  --authority <path-to-keypair.json> \
  --quote-mint <quote-mint-address> \
  [--fee <fee-percentage>] \
  [--mode <collect-fee-mode>] \
  [--option <migration-option>] \
  [--type <token-type>] \
  [--decimal <token-decimal>] \
  [--post-fee <post-migration-fee>] \
  [--threshold <migration-threshold>] \
  [--sqrt-price <sqrt-start-price>]
```

Options:
- `-a, --authority`: Path to authority keypair JSON file (required)
- `-q, --quote-mint`: Quote mint address (required)
- `-f, --fee`: Pool fee percentage (default: 0.3)
- `-m, --mode`: Collect fee mode (default: 0)
- `-o, --option`: Migration option (default: 0)
- `-t, --type`: Token type (default: 0)
- `-d, --decimal`: Token decimal (default: 6)
- `-p, --post-fee`: Post migration fee percentage (default: 0)
- `-th, --threshold`: Migration quote threshold (default: 0)
- `-s, --sqrt-price`: Square root start price (default: 1)

### Create Pool

Creates a new Virtual Curve pool.

```bash
vc create-pool \
  --config <config-address> \
  --authority <path-to-keypair.json> \
  --token-a <token-a-mint> \
  --token-b <token-b-mint> \
  --provider <path-to-provider-keypair.json> \
  --amount-a <initial-token-a-amount> \
  --amount-b <initial-token-b-amount>
```

Options:
- `-c, --config`: Config address (required)
- `-a, --authority`: Path to authority keypair JSON file (required)
- `-ta, --token-a`: Token A mint address (required)
- `-tb, --token-b`: Token B mint address (required)
- `-p, --provider`: Path to initial liquidity provider keypair JSON file (required)
- `-aa, --amount-a`: Initial token A amount (required)
- `-ab, --amount-b`: Initial token B amount (required)

### Swap

Execute a swap between tokens.

```bash
vc swap \
  --config <config-address> \
  --pool <pool-address> \
  --authority <path-to-keypair.json> \
  --user-token <user-token-account> \
  --base-vault <base-vault-address> \
  --quote-vault <quote-vault-address> \
  --token-a <token-a-mint> \
  --token-b <token-b-mint> \
  --token-program <token-program-address> \
  --amount-a <token-a-amount> \
  --amount-b <token-b-amount> \
  --slippage <slippage-tolerance> \
  --exact-in <true|false>
```

Options:
- `-c, --config`: Config address (required)
- `-p, --pool`: Pool address (required)
- `-a, --authority`: Path to authority keypair JSON file (required)
- `-u, --user-token`: User token account address (required)
- `-bv, --base-vault`: Base vault address (required)
- `-qv, --quote-vault`: Quote vault address (required)
- `-ta, --token-a`: Token A mint address (required)
- `-tb, --token-b`: Token B mint address (required)
- `-tp, --token-program`: Token program address (required)
- `-aa, --amount-a`: Token A amount (required)
- `-ab, --amount-b`: Token B amount (required)
- `-s, --slippage`: Slippage tolerance percentage (required)
- `-e, --exact-in`: Whether the input amount is exact (required, true/false)

## Examples

1. Create a configuration:
```bash
vc create-config \
  --authority ~/keypairs/authority.json \
  --quote-mint TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA \
  --fee 0.3 \
  --mode 0
```

2. Create a pool:
```bash
vc create-pool \
  --config <config-address> \
  --authority ~/keypairs/authority.json \
  --token-a <token-a-mint> \
  --token-b <token-b-mint> \
  --provider ~/keypairs/provider.json \
  --amount-a 1000000 \
  --amount-b 1000000
```

3. Execute a swap:
```bash
vc swap \
  --config <config-address> \
  --pool <pool-address> \
  --authority ~/keypairs/authority.json \
  --user-token <user-token-account> \
  --base-vault <base-vault> \
  --quote-vault <quote-vault> \
  --token-a <token-a-mint> \
  --token-b <token-b-mint> \
  --token-program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA \
  --amount-a 100000 \
  --amount-b 0 \
  --slippage 1 \
  --exact-in true
```
