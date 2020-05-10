interface Secp256k1PublicKey {
    x: string;
    y: string;
}
/**
 * @description A dummy signer which returns only public parts (publicKey and publicKeyHash). Secp256k1 specific.
 */
export declare class PublicOnlySigner {
    private _publicKey;
    /**
     * @param _publicKey Secp256k1 public Key in 64 bytes format (x,y)
     */
    constructor(_publicKey: Secp256k1PublicKey);
    /**
     *
     * @param bytes Bytes to sign
     * @param _watermark Watermark to append to the bytes
     */
    sign(bytes: string, _watermark?: Uint8Array): Promise<{
        bytes: string;
        sig: string;
        prefixSig: string;
        sbytes: string;
    }>;
    /**
     * @returns Encoded public key
     */
    publicKey(): Promise<string>;
    /**
     * @returns Encoded public key hash
     */
    publicKeyHash(): Promise<string>;
    /**
     * @returns Encoded private key
     */
    secretKey(): Promise<string>;
}
export {};
