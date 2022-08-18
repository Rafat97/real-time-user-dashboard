import { createClient } from 'redis';

export const redisConnectionCheck = async (connectionOption) => {
  console.log(connectionOption)
  const client = createClient({ ...connectionOption });
  await client.connect();
  console.log('redis connect successfully');
  await client.disconnect()
  return client;
};

export const redisSetData = async (connectionOption, key, value, exp) => {
  const client = await redisConnectionCheck(connectionOption);
  await client.set(key, value, { EX: exp });
  return value;
};
