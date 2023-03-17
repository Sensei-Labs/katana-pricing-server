import 'dotenv/config';
import fastifyServer from 'fastify';
import websocketPlugin from '@fastify/websocket';

import { getPricingAssetFromCache } from './app/cache/actions';
import { cacheStore } from './app/cache';
import runSocket from './app/socket';

const server = fastifyServer({
  logger: true,
});

server.register(websocketPlugin);

server.get('/ping', async () => 'pong');
server.get('/test', async () => {
  return getPricingAssetFromCache({
    store: cacheStore,
    assetSymbolList: ['SOL', 'USDC'],
  });
});

server.register(async (fastify) => {
  fastify.get('/', { websocket: true }, (connection) => {
    runSocket(connection);
  });
});

server.listen({ port: Number(process.env.PORT || 8080) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
