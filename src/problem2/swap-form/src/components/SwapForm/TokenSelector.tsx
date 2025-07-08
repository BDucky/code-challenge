import * as React from "react";
import { Check } from "lucide-react";
import { motion } from 'framer-motion';

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Token } from "@/hooks/useTokenPrices";
import { Input } from "../ui/input";


interface TokenSelectorProps {
  tokens: Token[];
  selectedToken?: Token;
  onSelectToken: (token: Token) => void;
  children: React.ReactNode;
  title: string;
}

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

const listVariants = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  hidden: {
    opacity: 0,
  },
};

const itemVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 20 },
};

export function TokenSelector({
  tokens,
  selectedToken,
  onSelectToken,
  children,
  title,
}: TokenSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const uniqueTokens = React.useMemo(() => {
    const seen = new Set<string>();
    return tokens.filter((token) => {
      if (seen.has(token.currency)) {
        return false;
      }
      seen.add(token.currency);
      return true;
    });
  }, [tokens]);

  const filteredTokens = React.useMemo(
    () =>
      uniqueTokens.filter((token) =>
        token.currency.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [uniqueTokens, searchQuery]
  );

  const handleSelect = (currency: string) => {
    const token = uniqueTokens.find((t) => t.currency === currency);
    if (token) {
      onSelectToken(token);
    }
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchQuery("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="p-4">
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="p-4 border-y border-gray-800">
          <Input
            placeholder="Search token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-gray-900"
          />
        </div>
        <Command className="bg-gray-900 p-2">
          <CommandList>
            <CommandEmpty className="text-gray-400">
              No token found.
            </CommandEmpty>
            <motion.div variants={listVariants} initial="hidden" animate="visible">
              <CommandGroup>
                {filteredTokens.map((token) => (
                  <motion.div variants={itemVariants} key={token.currency}>
                    <CommandItem
                      value={token.currency}
                      onSelect={() => handleSelect(token.currency)}
                      className="flex items-center justify-between hover:bg-gray-800 data-[selected=true]:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage
                            src={getIconForCurrency(token.currency)}
                            alt={token.currency}
                          />
                          <AvatarFallback className="bg-gray-700">
                            {token.currency.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-white">
                          {token.currency}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4 text-pink-500",
                          selectedToken?.currency === token.currency
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  </motion.div>
                ))}
              </CommandGroup>
            </motion.div>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
