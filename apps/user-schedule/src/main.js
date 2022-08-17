import { cancelJob, scheduleJob } from 'node-schedule';

const JOB_NAME = {
  GETTING_GENDER: 'schedule.GETTING_GENDER',
  GETTING_COUNTRY: 'schedule.GETTING_COUNTRY',
};

scheduleJob(JOB_NAME.GETTING_GENDER, '*/1 * * * * *', function () {
  const data = new Date();
  console.log(JOB_NAME.GETTING_GENDER + ' ' + data);
});

scheduleJob(JOB_NAME.GETTING_COUNTRY, '*/1 * * * * *', function () {
  const data = new Date();
  console.log(JOB_NAME.GETTING_COUNTRY + ' ' + data);
});
