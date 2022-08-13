export function appConfig() {
  const APP_DEPLOY_TYPE = process.env.APP_DEPLOY_TYPE || 'none';
  const APP_MONGODB_CONNECTION_STRING =
    process.env.APP_MONGODB_CONNECTION_STRING ||
    'mongodb://root:example@localhost:27017/user?authSource=admin&retryWrites=true&w=majority';
  const APP_REDIS_CONNECTION_STRING =
    process.env.APP_REDIS_CONNECTION_STRING || 'redis://:@127.0.0.1:6379';
  const APP_KAFKA_BROKER = (
    process.env.APP_KAFKA_BROKER || '127.0.0.1:9092'
  ).split(',');

  console.log(APP_MONGODB_CONNECTION_STRING);
  console.log(APP_REDIS_CONNECTION_STRING);
  console.log(APP_KAFKA_BROKER);
  console.log(APP_DEPLOY_TYPE);

  return {
    kafka: {
      brokers: [...APP_KAFKA_BROKER],
      requestTimeout: 10000,
      enforceRequestTimeout: true,
      connectionTimeout: 10000,
    },
    mongodb: {
      connectionString: APP_MONGODB_CONNECTION_STRING,
    },
    redis: {
      connectionString: APP_REDIS_CONNECTION_STRING,
    },
    deployType: APP_DEPLOY_TYPE,
  };
}
