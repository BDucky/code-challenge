import { useState, useEffect, useMemo } from 'react';
import { ArrowDownUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTokenPrices } from '@/hooks/useTokenPrices';
import type { Token } from '@/hooks/useTokenPrices';
import { TokenSelector } from './TokenSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import toast from 'react-hot-toast';

const getIconForCurrency = (currency: string): string => {
  const overrides: { [key: string]: string } = {
    RATOM: 'ATOM',
    STATOM: 'ATOM',
    STEVMOS: 'EVMOS',
    STLUNA: 'LUNA',
    STOSMO: 'OSMO',
  };
  const iconCurrency = overrides[currency] || currency;
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${iconCurrency}.svg`;
};



export default function SwapForm() {
  const { tokens, loading, error } = useTokenPrices();
  const [fromToken, setFromToken] = useState<Token | undefined>(undefined);
  const [toToken, setToToken] = useState<Token | undefined>(undefined);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (tokens.length > 0) {
        setFromToken(tokens.find(t => t.currency === 'ETH') || tokens[0]);
        setToToken(tokens.find(t => t.currency === 'USDC') || tokens[1]);
    }
  }, [tokens]);

  const exchangeRate = useMemo(() => {
    if (fromToken && toToken && fromToken.price && toToken.price) {
      return fromToken.price / toToken.price;
    }
    return 0;
  }, [fromToken, toToken]);

  useEffect(() => {
    if (fromAmount && exchangeRate) {
      const amount = parseFloat(fromAmount) * exchangeRate;
      setToAmount(amount.toFixed(5));
    } else {
      setToAmount('');
    }
  }, [fromAmount, exchangeRate]);

  const handleSwap = () => {
    if (!fromToken || !toToken || !fromAmount) {
        const errorMessage = 'Please enter an amount.';
        setFormError(errorMessage);
        toast.error(errorMessage);
        return;
    }
    if (fromToken.currency === toToken.currency) {
        const errorMessage = 'Cannot swap the same token.';
        setFormError(errorMessage);
        toast.error(errorMessage);
        return;
    }
    setFormError(null);
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      toast.success('Swap successful!');
      console.log('Swap successful!');
    }, 1500);
  };

  const handleTokenSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  }

  if (loading) return <p className="text-white">Loading tokens...</p>;
  if (error) return <p className="text-red-500">Error fetching tokens: {error.message}</p>;

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full bg-gray-900 border-gray-800 text-white shadow-lg shadow-pink-500/10">
      <CardHeader>
        <CardTitle className="text-pink-500">Currency Swap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="space-y-2">
            <div className="p-4 border border-gray-700 rounded-lg space-y-2">
              <label className="text-xs text-gray-400">Amount to send</label>
              <div className="flex justify-between items-center gap-2">
                <Input type="number" placeholder="0.0" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} className="bg-transparent border-none text-white placeholder:text-gray-500 text-2xl focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
                <TokenSelector tokens={tokens} selectedToken={fromToken} onSelectToken={setFromToken} title="Select send token">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    {fromToken && <Avatar className="h-6 w-6"><AvatarImage src={getIconForCurrency(fromToken.currency)} /><AvatarFallback>{fromToken.currency.slice(0,2)}</AvatarFallback></Avatar>}
                    <span className="font-bold text-white">{fromToken?.currency}</span>
                  </Button>
                </TokenSelector>
              </div>
            </div>
            <div className="p-4 border border-gray-700 rounded-lg space-y-2">
              <label className="text-xs text-gray-400">Amount to receive</label>
              <div className="flex justify-between items-center gap-2">
                <Input type="number" placeholder="0.0" value={toAmount} readOnly className="bg-transparent border-none text-white placeholder:text-gray-500 text-2xl focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
                <TokenSelector tokens={tokens} selectedToken={toToken} onSelectToken={setToToken} title="Select receive token">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    {toToken && <Avatar className="h-6 w-6"><AvatarImage src={getIconForCurrency(toToken.currency)} /><AvatarFallback>{toToken.currency.slice(0,2)}</AvatarFallback></Avatar>}
                    <span className="font-bold text-white">{toToken?.currency}</span>
                  </Button>
                </TokenSelector>
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div whileTap={{ rotate: 180 }}>
              <Button variant="outline" size="icon" className="rounded-full bg-gray-800 hover:bg-gray-700 border-gray-600" onClick={handleTokenSwap}>
                <ArrowDownUp className="h-4 w-4 text-pink-500" />
              </Button>
            </motion.div>
          </div>
        </div>
        
        {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}

        <Button onClick={handleSwap} disabled={isSwapping} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 flex items-center justify-center gap-2">
          {isSwapping ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Swapping...</span>
            </>
          ) : (
            'CONFIRM SWAP'
          )}
        </Button>
      </CardContent>
      </Card>
    </motion.div>
  );
}
