import { ExpressApplicationRouter } from '@rafat97/express-made-easy';
import { createKafkaProducerSend, mongoDBStatusCheck } from '@myapp/utils';
import { USER_EVENT } from '@myapp/event';

const APP_KAFKA_BROKER = (
  process.env.APP_KAFKA_BROKER || '127.0.0.1:9092'
).split(',');
const kafkaClientConfig = {
  brokers: [...APP_KAFKA_BROKER],
  requestTimeout: 10000,
  enforceRequestTimeout: true,
  connectionTimeout: 10000,
};
console.log(kafkaClientConfig);

const generateUserRoutes = new ExpressApplicationRouter();

generateUserRoutes.getMethod('/random/:id', async (req, res) => {
  console.log(mongoDBStatusCheck());
  const { id } = req.params;
  const totalUser = id;
  const message = [
    {
      value: JSON.stringify({
        totalUserCreate: totalUser,
        message: USER_EVENT.USER_CREATE_BULK_RANDOMUSERS,
        createAt: Date.now(),
      }),
    },
  ];
  await createKafkaProducerSend(kafkaClientConfig, {
    topic: USER_EVENT.USER_CREATE_BULK_RANDOMUSERS,
    messages: message,
  });
  res.status(200).send({
    result: `${totalUser} user data will generate using faker. Please wait few minutes. or you can visit http://localhost:8081/ url for seeing the database user status.`,
  });
});

export { generateUserRoutes };
