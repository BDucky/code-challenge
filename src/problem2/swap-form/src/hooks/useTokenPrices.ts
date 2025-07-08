import { useState, useEffect } from 'react';

export interface Token {
  currency: string;
  price: number;
  date: string;
}

export const useTokenPrices = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://interview.switcheo.com/prices.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Token[] = await response.json();
        const pricedTokens = data.filter(token => token.price > 0).sort((a, b) => a.currency.localeCompare(b.currency));
        setTokens(pricedTokens);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return { tokens, loading, error };
};
