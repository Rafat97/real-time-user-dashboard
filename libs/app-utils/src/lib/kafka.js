import { Kafka } from 'kafkajs';

export const createKafkaClient = (options) => {
  const kafka = new Kafka({
    ...options,
  });
  return kafka;
};

export const createKafkaProducerConnection = async (kafkaClientOption) => {
  const kafka = createKafkaClient(kafkaClientOption);
  const producer = kafka.producer();

  await producer.connect();
  console.log('producer connect successfully');
  return producer;
};

export const createKafkaProducerSend = async (
  kafkaClientOption,
  dataSendOptions
) => {
  const producer = await createKafkaProducerConnection(kafkaClientOption);
  await producer.send({
    ...dataSendOptions,
  });
  console.log('producer connect successfully');
  return producer;
};

export const createKafkaConsumer = async (
  kafkaClientOption,
  consumerOptions,
  subscribeOptions,
  runOptions
) => {
  const kafka = createKafkaClient(kafkaClientOption);
  const consumer = kafka.consumer({ ...consumerOptions });
  await consumer.connect();
  console.log('consumer connect successfully');
  await consumer.subscribe({ ...subscribeOptions });
  console.log('consumer subscribe successfully');
  await consumer.run({ ...runOptions });
  return consumer;
};
