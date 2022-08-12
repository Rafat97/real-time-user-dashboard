import 'dotenv/config';
import { ExpressApplication } from '@rafat97/express-made-easy';
import { allRequestHandler } from './utils/allRequestHandler';
import { healthRoutes } from './routes/health';
import { errorHandler } from './utils/demoErrorHandler';
import { generateUserRoutes } from './routes/generateUser';
import {
  createKafkaProducerConnection,
  mongoDBConnectionCheck,
  redisConnectionCheck,
} from '@myapp/utils';

const APP_MONGODB_CONNECTION_STRING =
  process.env.APP_MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/test';
const APP_REDIS_CONNECTION_STRING =
  process.env.APP_REDIS_CONNECTION_STRING || 'redis://:@127.0.0.1:6379';
const APP_KAFKA_BROKER = (
  process.env.APP_KAFKA_BROKER || '127.0.0.1:9092'
).split(',');

console.log(APP_MONGODB_CONNECTION_STRING);
console.log(APP_REDIS_CONNECTION_STRING);
console.log(APP_KAFKA_BROKER);

const config = {
  appName: 'user',
  appHost: '0.0.0.0',
  appPort: parseInt(process.env.APP_PORT || '9000') || 9000,
};

const kafkaClientConfig = {
  brokers: [...APP_KAFKA_BROKER],
  requestTimeout: 10000,
  enforceRequestTimeout: true,
  connectionTimeout: 10000,
};
const redisConfig = {
  url: APP_REDIS_CONNECTION_STRING,
};

const expressApp = new ExpressApplication(config).addDefaultMiddleware();
mongoDBConnectionCheck(
  APP_MONGODB_CONNECTION_STRING,
  async () => {
    await createKafkaProducerConnection(kafkaClientConfig);
    await redisConnectionCheck(redisConfig);
    expressApp
      .router('/v1/generate/users', generateUserRoutes)
      .router('/v1/health', healthRoutes)
      .allMethod('*', allRequestHandler)
      .addErrorHandler(errorHandler);
  },
  () => {
    console.log('mongo db connection error');
  }
);

export default expressApp;
