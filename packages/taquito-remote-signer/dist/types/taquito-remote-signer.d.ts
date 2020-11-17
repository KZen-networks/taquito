import { HttpBackend } from '@taquito/http-utils';
import { Signer } from '@taquito/taquito';
export interface RemoteSignerOptions {
    headers?: {
        [key: string]: string;
    };
}
export declare class RemoteSigner implements Signer {
    private pkh;
    private rootUrl;
    private options;
    private http;
    constructor(pkh: string, rootUrl: string, options?: RemoteSignerOptions, http?: HttpBackend);
    publicKeyHash(): Promise<string>;
    private createURL;
    publicKey(): Promise<string>;
    secretKey(): Promise<string>;
    sign(bytes: string, watermark?: Uint8Array): Promise<{
        bytes: string;
        sig: any;
        prefixSig: string;
        sbytes: string;
    }>;
    verify(bytes: string, signature: string): Promise<boolean>;
}
