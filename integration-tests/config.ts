import { localForger } from '@taquito/local-forging';
import { CompositeForger, RpcForger, TezosToolkit, Protocols } from '@taquito/taquito';
import { b58cencode, Prefix, prefix } from '@taquito/utils';
import fs from 'fs';

const nodeCrypto = require('crypto');

enum ForgerType {
  LOCAL = 'local',
  RPC = 'rpc',
  COMPOSITE = 'composite'
}

const forgers: ForgerType[] = [ForgerType.COMPOSITE];
const envConfig = process.env['TEZOS_RPC_NODE'];

interface Config {
  rpc: string,
  knownBaker: string,
  knownContract: string,
  protocol: Protocols
}

interface ConfigWithSetup extends Config {
  lib: TezosToolkit,
  setup: () => Promise<void>,
  createAddress: () => Promise<TezosToolkit>,
  protocol: Protocols
}

const providers: Config[] = envConfig ? JSON.parse(envConfig) : [
  {
    rpc: 'https://api.tez.ie/rpc/carthagenet',
    knownBaker: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
    knownContract: 'KT1XYa1JPKYVJYVJge89r4w2tShS8JYb1NQh',
    protocol: Protocols.PsCARTHA
  },
  {
    rpc: 'https://api.tez.ie/rpc/babylonnet',
    knownBaker: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
    knownContract: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK',
    protocol: Protocols.PsBabyM1
  }
];

const faucetKeyFile = process.env['TEZOS_FAUCET_KEY_FILE']

jest.setTimeout(60000 * 10);

export const CONFIGS: ConfigWithSetup[] =
  forgers.reduce((prev, forger: ForgerType) => {
    const configs = providers.map(({ rpc, knownBaker, knownContract, protocol }) => {
      const Tezos = new TezosToolkit();
      if (forger === ForgerType.LOCAL) {
        Tezos.setProvider({ rpc, forger: localForger })
      } else if (forger === ForgerType.COMPOSITE) {
        const rpcForger = Tezos.getFactory(RpcForger)();
        const composite = new CompositeForger([rpcForger, localForger]);
        Tezos.setProvider({ rpc, forger: composite })
      } else {
        Tezos.setProvider({ rpc })
      }
      return {
        rpc, knownBaker, knownContract, protocol, lib: Tezos, setup: async () => {
          let faucetKey = {
            email: "peqjckge.qkrrajzs@tezos.example.org",
            password: "y4BX7qS1UE", mnemonic: [
              "skate",
              "damp",
              "faculty",
              "morning",
              "bring",
              "ridge",
              "traffic",
              "initial",
              "piece",
              "annual",
              "give",
              "say",
              "wrestle",
              "rare",
              "ability"
            ],
            secret: "7d4c8c3796fdbf4869edb5703758f0e5831f5081"
          }
          if (faucetKeyFile) {
            faucetKey = JSON.parse(fs.readFileSync(faucetKeyFile).toString())
          }

          await Tezos.importKey(faucetKey.email, faucetKey.password, faucetKey.mnemonic.join(" "), faucetKey.secret)
        },
        createAddress: async () => {
          const tezos = new TezosToolkit()
          tezos.setProvider({ rpc: rpc })

          const keyBytes = new Buffer(32);
          nodeCrypto.randomFillSync(keyBytes)

          const key = b58cencode(new Uint8Array(keyBytes), prefix[Prefix.P2SK]);
          await tezos.importKey(key);

          return tezos;
        }
      };
    });
    return [...prev, ...configs]
  }, [] as ConfigWithSetup[]);

