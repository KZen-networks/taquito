export { EcdsaParty2Share } from '@kzen-networks/thresh-sig';
import { EcdsaParty2, EcdsaParty2Share } from '@kzen-networks/thresh-sig';
import { b58cencode, buf2hex, hex2buf, mergebuf, prefix } from '@taquito/utils';
const sodium = require('libsodium-wrappers');
const toBuffer = require('typedarray-to-buffer');

const pref = {
  pk: prefix['sppk'],
  sk: prefix['spsk'],
  pkh: prefix.tz2,
  sig: prefix.spsig,
};

export interface TwoPartySignerOptions {
  party1Endpoint: string;
  party2Share: EcdsaParty2Share;
}

export class TwoPartySigner {
  private p2: EcdsaParty2; // Secp256k1
  private p2Share: EcdsaParty2Share | undefined;
  private isInit: Promise<boolean>;

  constructor(options?: TwoPartySignerOptions) {
    this.p2 = new EcdsaParty2((options && options.party1Endpoint) || 'http://localhost:8000');
    this.p2Share = options && options.party2Share;
    this.isInit = this.init();
  }

  public async init() {
    if (!this.p2Share) {
      const masterKeyShare: EcdsaParty2Share = await this.p2.generateMasterKey();
      this.p2Share = this.p2.getChildShare(masterKeyShare, 0, 0);
    }
    return true;
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param watermark Watermark to append to the bytes
   */
  public async sign(
    bytes: string,
    watermark?: Uint8Array
  ): Promise<{
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
  }> {
    await this.isInit;
    let bb = hex2buf(bytes);
    if (typeof watermark !== 'undefined') {
      bb = mergebuf(watermark, bb);
    }

    const bytesHash = toBuffer(sodium.crypto_generichash(32, bb));

    const sig = await this.p2.sign(bytesHash, this.p2Share as EcdsaParty2Share, 0, 0);
    const signatureBuffer = sig.toBuffer();
    const signatureArray = Uint8Array.from(signatureBuffer);
    const sbytes = bytes + buf2hex(signatureBuffer);

    return {
      bytes,
      sig: b58cencode(signatureArray, prefix.sig),
      prefixSig: b58cencode(signatureArray, pref.sig),
      sbytes,
    };
  }

  /**
   * @description Return the public key of the account used by the signer
   */
  public async publicKey(): Promise<string> {
    await this.isInit;
    const publicKey = new Uint8Array(
      (this.p2Share as EcdsaParty2Share).getPublicKey().encodeCompressed()
    );
    return b58cencode(publicKey, pref.pk);
  }

  /**
   * @description Return the public key hash of the account used by the signer
   */
  public async publicKeyHash(): Promise<string> {
    await this.isInit;
    await sodium.ready;
    const publicKey = (this.p2Share as EcdsaParty2Share).getPublicKey().encodeCompressed();
    return b58cencode(sodium.crypto_generichash(20, new Uint8Array(publicKey)), pref.pkh);
  }

  /**
   * @description Optionally return the secret SHARE of the account used by the signer
   */
  public async secretKey(): Promise<string | undefined> {
    await this.isInit;
    return this.p2Share && JSON.stringify(this.p2Share);
  }
}
