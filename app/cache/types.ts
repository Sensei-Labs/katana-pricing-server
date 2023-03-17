export enum ValidEnumProvider {
  SOLANA = 'solana',
  USDC = 'usd-coin',
}

export enum CurrencyEnumProvider {
  SOL = 'SOL',
  USDC = 'USDC',
}

export type CurrencyCoinType = {
  symbol: CurrencyEnumProvider;
  slug: ValidEnumProvider;
  quote: {
    USD: {
      price: number;
    };
  };
};

export type ResponseCoinMarketCapType = {
  data: {
    [key: string]: CurrencyCoinType[];
  };
};

export type ResponseServiceType = {
  price: number;
  symbol: CurrencyEnumProvider;
};
