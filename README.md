
<span style="display:block;text-align:center">![Logo](https://tezostaquito.io/img/Taquito.png)</span>

_This is a **Forked** version of ECAD Labs' [original taquito repository](https://github.com/ecadlabs/taquito),
to demonstrate Tezos transactions signing using Two-Party ECDSA._

Using two-party signatures allows to eliminate the risk of having a single private key. Instead, the generation and usage  
of secrets is _splitted_ between two parties, and the single key is never present in a single place. 

## Installation

1. If on Linux, install needed packages:
```sh
$ sudo apt-get update
$ sudo apt-get install libgmp3-dev pkg-config libssl-dev clang libclang-dev
```
2. Install [Node.js](https://nodejs.org/en/download/)<br>
(tested on Node 10)
3. Install [nightly Rust](https://github.com/rust-lang/rustup.rs#installation)<br>
(tested on rustc 1.38.0-nightly (0b680cfce 2019-07-09))
4. Clone the repository:
```
$ git clone https://github.com/KZen-networks/taquito.git
$ cd taquito
$ npm install -g lerna
$ npm install
$ lerna bootstrap
$ npm run build
```

## Demo
First, launch the server.<br>
It functions as the co-signer in the two-party signing protocol
(If you want to see logs of incoming requests, set the environment variable `ROCKET_LOG` to `debug`).
```
$ demo/server
🔧 Configured for production.
    => address: 0.0.0.0
    => port: 8000
    => log: critical
    => workers: 24
    => secret key: private-cookies disabled
    => limits: forms = 32KiB
    => keep-alive: 5s
    => tls: disabled
🚀 Rocket has launched from http://0.0.0.0:8000
```
Client:
```
$ demo/client --help
Usage: client [options] [command]

Options:
  -h, --help                                     output usage information

Commands:
  generate-address|a                             Generate a new Tezos address
  list-address|la                                List all previously generated addresses
  balance|b [options] <address>                  Get the balance of a given address
  transfer|t [options] <from> <to> <xtz_amount>  Transfer XTZ
  transfer-all|ta [options] <from> <to>          Transfer all XTZ funds from a given account
  delegate|d [options] <from> <to>               Delegate funds to a baker account
  subscribe|s [options] <address>                Subscribe to get notifications regarding operations involving given address
  validate|v <address>                           Validate given string is a valid Tezos address
  is-active|ia [options] <address>               is given Tezos address active
```

|![Transfer demo](https://raw.githubusercontent.com/KZen-networks/taquito/master/demo/tezos-tss-demo.gif "Tezos Threshold Wallet Demo")|
|:--:|
