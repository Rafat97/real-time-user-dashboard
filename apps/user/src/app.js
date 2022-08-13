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
import { userRoutes } from './routes/user';
import { appConfig } from '@myapp/app-config';
const appConfigValues = appConfig();

const config = {
  appName: 'user',
  appHost: '0.0.0.0',
  appPort: parseInt(process.env.APP_PORT || '9000') || 9000,
};

const kafkaClientConfig = { ...appConfigValues.kafka };
const redisConfig = {
  url: appConfigValues.redis.connectionString,
};

const expressApp = new ExpressApplication(config).addDefaultMiddleware();
mongoDBConnectionCheck(
  appConfigValues.mongodb.connectionString,
  async () => {
    await createKafkaProducerConnection(kafkaClientConfig);
    await redisConnectionCheck(redisConfig);
    expressApp
      .router('/v1/generate/users', generateUserRoutes)
      .router('/v1/user', userRoutes)
      .router('/v1/health', healthRoutes)
      .allMethod('*', allRequestHandler)
      .addErrorHandler(errorHandler);
  },
  () => {
    console.log('mongo db connection error');
  }
);

export default expressApp;
