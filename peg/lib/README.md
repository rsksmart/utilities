# ProxyWallet LIB
## Utility for the BTC <=> RSK 2WP

### Prerequisites

1. A local running BTC wallet with JSON-RPC capabilities
1. A local running RSK wallet with JSON-RPC capabilities
2. `node` and `npm`


### Installation

1. Clone this repo
2. Run `npm install`
3. Run `./lib.js --h` to learn available commands and how to use them

### Notes

Both on the `to-btc` and `to-sbtc` commands, independent mining is required both on the BTC and RSK blockchains to fulfill the issued transactions. 
In regtest this is trivially done, either by the miner client (RSK) or the `generate` command (BTC).


