import { MichelsonV1Expression } from '@taquito/rpc';
export declare type MichelsonMapKey = Array<any> | Object | string | boolean | number;
export declare class MapTypecheckError implements Error {
    readonly value: any;
    readonly type: any;
    name: string;
    message: string;
    constructor(value: any, type: any, errorType: 'key' | 'value');
}
/**
 * @description Michelson Map is an abstraction over the michelson native map. It supports complex Pair as key
 */
export declare class MichelsonMap<K extends MichelsonMapKey, T extends any> {
    private valueMap;
    private keyMap;
    private keySchema?;
    private valueSchema?;
    /**
     * @param mapType If specified key and value will be type-checked before being added to the map
     *
     * @example new MichelsonMap({ prim: "map", args: [{prim: "string"}, {prim: "int"}]})
     */
    constructor(mapType?: MichelsonV1Expression);
    setType(mapType: MichelsonV1Expression): void;
    removeType(): void;
    static fromLiteral(obj: {
        [key: string]: any;
    }, mapType?: MichelsonV1Expression): MichelsonMap<MichelsonMapKey, any>;
    private typecheckKey;
    private typecheckValue;
    private assertTypecheckValue;
    private assertTypecheckKey;
    private serializeDeterministically;
    keys(): Generator<K>;
    values(): Generator<T>;
    entries(): Generator<[K, T]>;
    get(key: K): T | undefined;
    /**
     *
     * @description Set a key and a value in the MichelsonMap. If the key already exists, override the current value.
     *
     * @example map.set("myKey", "myValue") // Using a string as key
     *
     * @example map.set({0: "test", 1: "test1"}, "myValue") // Using a pair as key
     *
     * @warn The same key can be represented in multiple ways, depending on the type of the key. This duplicate key situation will cause a runtime error (duplicate key) when sending the map data to the Tezos RPC node.
     *
     * For example, consider a contract with a map whose key is of type boolean.  If you set the following values in MichelsonMap: map.set(false, "myValue") and map.set(null, "myValue").
     *
     * You will get two unique entries in the MichelsonMap. These values will both be evaluated as falsy by the MichelsonEncoder and ultimately rejected by the Tezos RPC.
     */
    set(key: K, value: T): void;
    delete(key: K): void;
    has(key: K): boolean;
    clear(): void;
    readonly size: number;
    forEach(cb: (value: T, key: K, map: MichelsonMap<K, T>) => void): void;
}
