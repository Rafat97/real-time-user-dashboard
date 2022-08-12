import {
  mongoDBConnectionCheckSync,
  redisConnectionCheck,
  createKafkaConsumer,
  createKafkaProducerSend,
} from '@myapp/utils';
import { USER_EVENT } from '@myapp/event';
import { createRandomUser } from './functions/createUser';

const APP_MONGODB_CONNECTION_STRING =
  process.env.APP_MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/test';
const APP_REDIS_CONNECTION_STRING =
  process.env.APP_REDIS_CONNECTION_STRING || 'redis://:@127.0.0.1:6379';
const APP_KAFKA_BROKER = (
  process.env.APP_KAFKA_BROKER || '127.0.0.1:9092'
).split(',');

const kafkaClientConfig = {
  brokers: [...APP_KAFKA_BROKER],
  requestTimeout: 10000,
  enforceRequestTimeout: true,
  connectionTimeout: 10000,
};
const redisConfig = {
  url: APP_REDIS_CONNECTION_STRING,
};

const kafkaConsumerGroupId = 'user-consumer-create';
const kafkaConsumerOption = { groupId: kafkaConsumerGroupId };
const kafkaConsumerSubOption = {
  topics: [USER_EVENT.USER_ALL_EVENTS],
  fromBeginning: true,
};
const kafkaConsumerRun = {
  eachMessage: async ({ topic, partition, message }) => {
    console.log(
      `start ---> [${topic}] [${partition}] [${message.value?.toString()}]`
    );
    try {
      // console.log(topic);
      // console.log(partition);
      if (topic === USER_EVENT.USER_CREATE_BULK_RANDOMUSERS) {
        const stringToObject = JSON.parse(message.value?.toString());
        createRandomUser(stringToObject);
        console.log('completed createRandomUser');
      }
      console.log(`[${topic}] [${partition}] [${message.value?.toString()}]`);
    } catch (error) {
      console.log(error);
    }
    console.log(
      `end ---> [${topic}] [${partition}] [${message.value?.toString()}]`
    );
  },
};
const messagePing = [
  {
    value: JSON.stringify({
      message: `${kafkaConsumerGroupId} ping check`,
      createAt: Date.now(),
    }),
  },
];

const init = async () => {
  await mongoDBConnectionCheckSync(APP_MONGODB_CONNECTION_STRING);
  await redisConnectionCheck(redisConfig);

  await createKafkaProducerSend(kafkaClientConfig, {
    topic: USER_EVENT.USER_CONSUMER_PING,
    messages: messagePing,
  });
  const consumerInstance = await createKafkaConsumer(
    kafkaClientConfig,
    kafkaConsumerOption,
    kafkaConsumerSubOption,
    kafkaConsumerRun
  );

  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
    process.on(signal, async () => {
      await consumerInstance.disconnect();
      console.log('Process End');
      process.exit();
    })
  );
};

init();
