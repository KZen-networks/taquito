
<span style="display:block;text-align:center">![Logo](https://tezostaquito.io/img/Taquito.png)</span>

_This is a **Forked** version of ECAD Labs' [original taquito repository](https://github.com/ecadlabs/taquito),
to demonstrate Tezos transactions signing using Two-Party ECDSA._

Using two-party signatures allows to eliminate the risk of having a single private key. Instead, the generation and usage  
of secrets is _splitted_ between two parties, and the single key is never present in a single place. 

## Installation

1. Install [Node.js](https://nodejs.org/en/download/)<br>
(tested on Node 10)
2. Install [nightly Rust](https://github.com/rust-lang/rustup.rs#installation)<br>
(tested on rustc 1.38.0-nightly (0b680cfce 2019-07-09))
3. Clone the repository:
```
$ git clone https://github.com/KZen-networks/taquito.git
$ cd taquito
$ npm install
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
  address|a
  balance|b [options] <address>
  transfer|t [options] <from> <to> <xtz_amount>
  transfer-all|ta [options] <from> <to>
  delegate [options] <from> <to>                 Delegate funds to a baker account
  subscribe [options] <address>                  Subscribe to get notifications regarding operations involving given address
  validate|v <address>                           Validate given string is a valid Tezos address
```
