import WS from 'ws';
export declare class Subscription {
    private readonly ws;
    private errorListeners;
    private messageListeners;
    private closeListeners;
    constructor(ws: WS);
    private call;
    private remove;
    on(type: 'error', cb: (error: Error) => void): void;
    on(type: 'data', cb: (data: string) => void): void;
    on(type: 'close', cb: () => void): void;
    off(type: 'error', cb: (error: Error) => void): void;
    off(type: 'data', cb: (data: string) => void): void;
    off(type: 'close', cb: () => void): void;
    close(): void;
}
export declare class StreamerProvider {
    private url;
    constructor(url?: string);
    subscribe(_filter: 'head'): Subscription;
}
