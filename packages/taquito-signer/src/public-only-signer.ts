const sodium = require('libsodium-wrappers');
import { b58cencode, prefix } from '@taquito/utils';
const elliptic = require('elliptic');

const pref = {
  pk: prefix['sppk'],
  pkh: prefix.tz2,
};

// coordinates represented as hex strings
interface Secp256k1PublicKey {
  x: string;
  y: string;
}

/**
 * @description A dummy signer which returns only public parts (publicKey and publicKeyHash). Secp256k1 specific.
 */
export class PublicOnlySigner {
  private _publicKey: Uint8Array;

  /**
   * @param _publicKey Secp256k1 public Key in 64 bytes format (x,y)
   */
  constructor(_publicKey: Secp256k1PublicKey) {
    const keyPair = new elliptic.ec('secp256k1').keyFromPublic(_publicKey);
    this._publicKey = keyPair.getPublic().encodeCompressed('array');
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param _watermark Watermark to append to the bytes
   */
  async sign(bytes: string, _watermark?: Uint8Array) {
    return {
      bytes,
      sig: '',
      prefixSig: '',
      sbytes: bytes,
    };
  }

  /**
   * @returns Encoded public key
   */
  async publicKey(): Promise<string> {
    return b58cencode(this._publicKey, pref.pk);
  }

  /**
   * @returns Encoded public key hash
   */
  async publicKeyHash(): Promise<string> {
    await sodium.ready;
    return b58cencode(sodium.crypto_generichash(20, new Uint8Array(this._publicKey)), pref.pkh);
  }

  /**
   * @returns Encoded private key
   */
  async secretKey(): Promise<string> {
    return '';
  }
}
