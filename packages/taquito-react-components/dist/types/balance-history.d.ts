import React from 'react';
export interface BalanceProps {
    start: number;
    end: number;
    address: string;
    format?: 'tz' | 'mtz';
}
export declare class BalanceHistory extends React.Component<BalanceProps, {
    balance?: object[];
    error: boolean;
}> {
    static contextType: React.Context<import("@taquito/taquito").TezosToolkit>;
    constructor(props: BalanceProps);
    refreshBalance(): Promise<void>;
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: BalanceProps): Promise<void>;
    render(): JSX.Element;
}
