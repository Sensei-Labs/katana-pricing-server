import { caching } from 'cache-manager';
import { PRICING_INTERVAL_EXEC } from './constants';

export const cacheStore = caching('memory', {
  ttl: PRICING_INTERVAL_EXEC,
});
