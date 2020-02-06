export declare class TezBridgeSigner {
    constructor();
    publicKeyHash(): Promise<string>;
    publicKey(): Promise<string>;
    secretKey(): Promise<string>;
    sign(bytes: string, _watermark?: Uint8Array): Promise<{
        bytes: string;
        sig: any;
        prefixSig: any;
        sbytes: string;
    }>;
}
