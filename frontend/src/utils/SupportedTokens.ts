export const ARBITRUM_SEPOLIA = 'Arbitrum Sepolia';
export const SEPOLIA = 'Ethereum Sepolia';

const chainNames: { [key: number]: string } = {
    11155111: SEPOLIA,
    421614: ARBITRUM_SEPOLIA,
};

export const DEFAULT_VALUE = (chainId: number): string => {

    return chainNames[chainId] || 'Unknown Chain';
};
