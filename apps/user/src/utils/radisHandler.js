import { appConfig } from '@myapp/app-config';
import { createClient } from 'redis';

const appConfigValues = appConfig();
const redisConfig = {
  url: appConfigValues.redis.connectionString,
};

export const radiusCacheHandler = async (key, exp, dataStoreFn) => {
  const client = createClient({ ...redisConfig });
  await client.connect();
  let cacheData = await client.get(key);
  if (!cacheData) {
    console.log('cache not hit');
    cacheData = JSON.stringify(await dataStoreFn());
    await client.set(key, cacheData, {
      EX: exp,
    });
  }
  await client.disconnect();
  return JSON.parse(cacheData);
};
