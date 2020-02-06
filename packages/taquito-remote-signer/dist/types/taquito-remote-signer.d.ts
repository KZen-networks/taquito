import { HttpBackend } from '@taquito/http-utils';
export declare class RemoteSigner {
    private pkh;
    private rootUrl;
    private http;
    constructor(pkh: string, rootUrl: string, http?: HttpBackend);
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
}
