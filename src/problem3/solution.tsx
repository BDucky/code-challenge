import React, { useMemo } from 'react';

// --- Type Definitions ---
// Added 'blockchain' to WalletBalance and defined a specific type for it.
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

// Assuming BoxProps is from a UI library like Chakra UI or MUI
interface BoxProps {
  children?: React.ReactNode;
  [key: string]: any; // Allow other props
}

interface Props extends BoxProps {}

// --- Utility Functions (moved outside component) ---
// By defining getPriority outside the component, we prevent it from being
// recreated on every render. It's a pure function.
const getPriority = (blockchain: Blockchain): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
      return 20;
    case 'Neo':
      return 20;
    default:
      // This case should not be reachable if using the Blockchain type,
      // but it's good practice for robustness.
      return -99;
  }
};

// --- Main Component ---
const WalletPage: React.FC<Props> = (props: Props) => {
  // Removed destructuring of 'children' as it was unused.
  const { ...rest } = props;

  // These would be replaced by actual hook implementations.
  const balances: WalletBalance[] = useWalletBalances();
  const prices: Record<string, number> = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const priority = getPriority(balance.blockchain);
        // Corrected logic: filter out balances with no priority or non-positive amounts.
        return priority > -99 && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // Sort in descending order of priority.
        return rightPriority - leftPriority;
      });
  }, [balances]);

  const rows = sortedBalances.map((balance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        // Using a unique and stable key is crucial for performance and correctness.
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        // Formatting is done directly here.
        formattedAmount={balance.amount.toFixed()}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

// --- Mock Data and Hooks (for demonstration) ---
// These are placeholders for the actual hooks.
const useWalletBalances = (): WalletBalance[] => {
  return [
    { currency: 'OSMO', amount: 150.5, blockchain: 'Osmosis' },
    { currency: 'ETH', amount: 10.2, blockchain: 'Ethereum' },
    { currency: 'ARB', amount: 500, blockchain: 'Arbitrum' },
    { currency: 'ZIL', amount: 8888, blockchain: 'Zilliqa' },
    { currency: 'NEO', amount: 200, blockchain: 'Neo' },
    { currency: 'ATOM', amount: 50, blockchain: 'Osmosis' }, // Another Osmosis balance
    { currency: 'BTC', amount: 0, blockchain: 'Ethereum' }, // Zero balance
  ];
};

const usePrices = (): Record<string, number> => {
  return {
    OSMO: 1.5,
    ETH: 3000,
    ARB: 1.2,
    ZIL: 0.05,
    NEO: 15,
    ATOM: 10,
  };
};

// --- Dummy Component for Rendering ---
// This is a placeholder for the actual WalletRow component.
const WalletRow: React.FC<{ 
  key: string;
  amount: number; 
  usdValue: number; 
  formattedAmount: string 
}> = ({ amount, usdValue, formattedAmount }) => (
  <div style={{ border: '1px solid #ccc', margin: '5px', padding: '10px' }}>
    <p>Amount: {amount}</p>
    <p>Formatted Amount: {formattedAmount}</p>
    <p>USD Value: ${usdValue.toFixed(2)}</p>
  </div>
);

export default WalletPage;
