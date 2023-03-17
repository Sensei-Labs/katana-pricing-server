import axios from 'axios';
import type { MemoryCache } from 'cache-manager';
import {
  CurrencyEnumProvider,
  ResponseCoinMarketCapType,
  ResponseServiceType,
  ValidEnumProvider,
} from '../types';

const instance = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com',
  headers: {
    'X-CMC_PRO_API_KEY': process.env.APP_COINMARKETCAP_API_KEY,
  },
});

async function getCurrencyFromApi(assetSymbolList: string[]) {
  const params = {
    symbol: assetSymbolList.join(','),
  };

  try {
    const { data: dataCurrency } =
      await instance.get<ResponseCoinMarketCapType>(
        '/v2/cryptocurrency/quotes/latest',
        {
          params,
        },
      );

    return Object.values(dataCurrency.data).map((item) => {
      const findValidProvider = item.find((find) => {
        return (
          find.slug === ValidEnumProvider.SOLANA ||
          find.slug === ValidEnumProvider.USDC
        );
      });

      return {
        symbol: findValidProvider.symbol,
        price: findValidProvider.quote.USD.price,
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function setCurrenciesToCache(
  cacheStore: MemoryCache,
  currencyList: ResponseServiceType[],
) {
  for (let i = 0; i < currencyList.length; i++) {
    const currency = currencyList[i];
    await cacheStore.set(currency.symbol, currency.price);
  }
}

export async function getPricingAssetFromCache({
  assetSymbolList,
  store,
}: {
  store: Promise<MemoryCache>;
  assetSymbolList: string[];
}): Promise<ResponseServiceType[]> {
  const cacheStore = await store;
  const output: ResponseServiceType[] = [];

  for (let i = 0; i < assetSymbolList.length; i++) {
    const symbol = assetSymbolList[i];
    const dataCache = await cacheStore.get(symbol);

    if (dataCache) {
      console.log(`--- ${symbol} price in cache found ---`);
      output.push({
        symbol: symbol as CurrencyEnumProvider,
        price: dataCache as number,
      });
    } else {
      const currencyList = await getCurrencyFromApi(assetSymbolList);
      console.log(currencyList);
      await setCurrenciesToCache(cacheStore, currencyList);
      const assetCache = await cacheStore.get(symbol);
      if (assetCache) {
        output.push({
          symbol: symbol as CurrencyEnumProvider,
          price: assetCache as number,
        });
      }
    }
  }

  return output;
}
