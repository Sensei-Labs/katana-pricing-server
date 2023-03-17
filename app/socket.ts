import 'dotenv/config';
import { getPricingAssetFromCache } from './cache/actions';
import { cacheStore } from './cache';

const ONE_MINUTES = 1000 * 15;

export default function runSocket(connection: any) {
  connection.socket.on('message', async (input: string) => {
    const assetList = JSON.parse(input);
    console.log('Tokens: %s', assetList);
    if (!Array.isArray(assetList)) return;

    const assets = await getPricingAssetFromCache({
      store: cacheStore,
      assetSymbolList: assetList,
    });

    connection.socket.send(JSON.stringify(assets));

    setInterval(() => {
      connection.socket.send(JSON.stringify(assets));
    }, ONE_MINUTES * Number(process.env.APP_INTERVAL_SEND_MINUTES || 1));
  });
}
