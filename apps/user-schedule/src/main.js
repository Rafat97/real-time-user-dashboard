import { scheduleJob } from 'node-schedule';
import { appConfig } from '@myapp/app-config';
import { mongoDBConnectionCheckSync, redisConnectionCheck } from '@myapp/utils';
import { createClient } from 'redis';
import {
  getGenderAggregation,
  getUserCountryAggregation,
} from '@myapp/app-models';
import * as hash from 'object-hash';

const appConfigValues = appConfig();
const mongodbConnectionString = appConfigValues.mongodb.connectionString;
const redisConfig = {
  url: appConfigValues.redis.connectionString,
};

const JOB_NAME = {
  GETTING_GENDER: 'schedule.GETTING_GENDER',
  GETTING_COUNTRY: 'schedule.GETTING_COUNTRY',
};

const getGenderCountData = async (cacheClient) => {
  const cacheKey = hash({
    url: '/v1/user/agg/gender',
  });
  const aggData = await getGenderAggregation();
  const data = JSON.stringify(aggData);
  console.log(data);
  await cacheClient.set(cacheKey, data);
};

const getCountryCountData = async (cacheClient) => {
  const cacheKey = hash({
    url: '/v1/user/agg/country',
  });
  const aggData = await getUserCountryAggregation();
  const data = JSON.stringify(aggData);
  console.log(data);
  await cacheClient.set(cacheKey, data);
};

const init = async () => {
  await mongoDBConnectionCheckSync(mongodbConnectionString);
  await redisConnectionCheck(redisConfig);
  const client = createClient({ ...redisConfig });
  await client.connect();
  for (const key in JOB_NAME) {
    if (Object.hasOwnProperty.call(JOB_NAME, key)) {
      const element = JOB_NAME[key];
      await client.del(element);
    }
  }

  scheduleJob(JOB_NAME.GETTING_GENDER, '*/1 * * * * *', async () => {
    const client = createClient({ ...redisConfig });
    await client.connect();
    const scheduleStatus =
      (await client.get(JOB_NAME.GETTING_GENDER)) || 'DONE';
    if (scheduleStatus === 'DONE') {
      await client.set(JOB_NAME.GETTING_GENDER, 'RUNNING');
      console.log(`START--->${JOB_NAME.GETTING_GENDER}-${new Date()}`);
      await getGenderCountData(client);
      console.log(`DONE--->${JOB_NAME.GETTING_GENDER}-${new Date()}`);
      await client.set(JOB_NAME.GETTING_GENDER, 'DONE');
    }
    await client.disconnect();
  });

  scheduleJob(JOB_NAME.GETTING_COUNTRY, '*/1 * * * * *', async () => {
    const client = createClient({ ...redisConfig });
    await client.connect();

    const scheduleStatus =
      (await client.get(JOB_NAME.GETTING_COUNTRY)) || 'DONE';
    if (scheduleStatus === 'DONE') {
      await client.set(JOB_NAME.GETTING_COUNTRY, 'RUNNING');
      console.log(`START--->${JOB_NAME.GETTING_COUNTRY}-${new Date()}`);
      await getCountryCountData(client);
      console.log(`DONE--->${JOB_NAME.GETTING_COUNTRY}-${new Date()}`);
      await client.set(JOB_NAME.GETTING_COUNTRY, 'DONE');
    }
    await client.disconnect();
  });
};

init();
