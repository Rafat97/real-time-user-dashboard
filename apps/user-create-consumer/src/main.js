import {
  mongoDBConnectionCheckSync,
  redisConnectionCheck,
  createKafkaConsumer,
  createKafkaProducerSend,
  createKafkaAdminTopic,
} from '@myapp/utils';
import { USER_EVENT } from '@myapp/event';
import {
  createRandomUser,
  createUserActivate,
  deleteUserActivate,
} from '@myapp/app-models';
import { appConfig } from '@myapp/app-config';

const appConfigValues = appConfig();

const kafkaClientConfig = {
  brokers: [...appConfigValues.kafka.brokers],
  requestTimeout: 10000,
  enforceRequestTimeout: true,
  connectionTimeout: 10000,
};
const redisConfig = {
  url: appConfigValues.redis.APP_REDIS_CONNECTION_STRING,
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
      if (topic === USER_EVENT.USER_CREATE_BULK_RANDOMUSERS) {
        const stringToObject = JSON.parse(message.value?.toString());
        createRandomUser(stringToObject);
        console.log('completed createRandomUser');
      } else if (topic === USER_EVENT.USER_ACTIVATE_CREATE) {
        const stringToObject = JSON.parse(message.value?.toString());
        createUserActivate(stringToObject.body);
        console.log('completed USER_ACTIVATE_CREATE');
      } else if (topic === USER_EVENT.USER_DELETED_SINGLE) {
        const stringToObject = JSON.parse(message.value?.toString());
        deleteUserActivate(stringToObject.body.deleteId);
        console.log('completed USER_ACTIVATE_CREATE');
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
  await mongoDBConnectionCheckSync(appConfigValues.mongodb.connectionString);
  await redisConnectionCheck(redisConfig);

  // topic created
  for (let data in USER_EVENT) {
    const topicName = USER_EVENT[data];
    if (topicName == USER_EVENT.USER_ALL_EVENTS) {
      continue;
    }
    console.log(topicName);
    await createKafkaAdminTopic(kafkaClientConfig, {
      // validateOnly: true,
      waitForLeaders: true,
      topics: [
        {
          topic: topicName,
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });
  }

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
