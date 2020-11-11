import React from 'react';
export interface BalanceProps {
    address: string;
    format?: 'tz' | 'mtz';
}
export declare class Balance extends React.Component<BalanceProps, {
    balance: string | null;
    error: boolean;
}> {
    static contextType: React.Context<import("@taquito/taquito").TezosToolkit>;
    constructor(props: BalanceProps);
    refreshBalance(): Promise<void>;
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: BalanceProps): Promise<void>;
    render(): JSX.Element;
}
