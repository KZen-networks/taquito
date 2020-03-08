import { Decoder } from '../decoder';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
export declare const ManagerOperationSchema: {
    branch: string;
    contents: string[];
};
export declare const ActivationSchema: {
    pkh: string;
    secret: string;
};
export declare const RevealSchema: {
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    public_key: string;
};
export declare const DelegationSchema: {
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    delegate: string;
};
export declare const TransactionSchema: {
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    amount: string;
    destination: string;
    parameters: string;
};
export declare const OriginationSchema: {
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    balance: string;
    delegate: string;
    script: string;
};
export declare const BallotSchema: {
    source: string;
    period: string;
    proposal: string;
    ballot: string;
};
export declare const EndorsementSchema: {
    level: string;
};
export declare const SeedNonceRevelationSchema: {
    level: string;
    nonce: string;
};
export declare const ProposalsSchema: {
    source: string;
    period: string;
    proposals: string;
};
export declare const operationEncoder: (encoders: {
    [key: string]: (val: {}) => string;
}) => (operation: {
    kind: string;
}) => string;
export declare const operationDecoder: (decoders: {
    [key: string]: Decoder;
}) => (value: Uint8ArrayConsumer) => {
    kind: string;
};
export declare const schemaEncoder: (encoders: {
    [key: string]: (val: {}) => string;
}) => (schema: {
    [key: string]: string | string[];
}) => <T extends {
    [key: string]: any;
}>(value: T) => string;
export declare const schemaDecoder: (decoders: {
    [key: string]: Decoder;
}) => (schema: {
    [key: string]: string | string[];
}) => (value: Uint8ArrayConsumer) => {};
