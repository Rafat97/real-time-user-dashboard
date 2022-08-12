import { createClient } from 'redis';

export const redisConnectionCheck = async (connectionOption) => {
  const client = createClient({ ...connectionOption });
  await client.connect();
  console.log('redis connect successfully');
  return client;
};
