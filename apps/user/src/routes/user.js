import { ExpressApplicationRouter } from '@rafat97/express-made-easy';
import { createKafkaProducerSend } from '@myapp/utils';
import { USER_EVENT } from '@myapp/event';
import { BadRequestValidation } from '@rafat97/exceptionhandler';
import {
  createUser,
  updateUserInfo,
  UserActivityModel,
  UserModel,
} from '@myapp/app-models';
import { appConfig } from '@myapp/app-config';
import { convertToInternationalCurrencySystem } from '@myapp/utils';
import { radiusCacheHandler } from '../utils/radisHandler';
import * as hash from 'object-hash';
import { inputValidation } from '../middleware/inputValidation';

const appConfigValues = appConfig();

const kafkaClientConfig = { ...appConfigValues.kafka };

const userRoutes = new ExpressApplicationRouter();

// get all user
userRoutes.getMethod('/', async (req, res) => {
  const cacheKey = hash({
    url: req.originalUrl,
  });
  const getAllUsers = await radiusCacheHandler(cacheKey, 5, async () => {
    const limit = req.query.limit * 1 || 10;
    const page = req.query.page * 1 || 1;
    const skip = (page - 1) * limit;
    const sortBy = (req.query.sortBy || '-createdAt').split(',').join(' ');
    const email = req.query.email || null;
    const id = req.query._id || null;
    const name = req.query.name || null;
    const country = req.query.country || null;
    const search = req.query.search || null;
    let filter = {};

    if (email) {
      filter = { ...filter, email: email };
    }
    if (id) {
      filter = { ...filter, _id: id };
    }
    if (name) {
      filter = {
        ...filter,
        $text: { $search: `"${name}"`, $caseSensitive: false },
      };
    }
    if (country) {
      filter = { ...filter, $text: { $search: `"${country}"` } };
    }
    if (search) {
      filter = { ...filter, $text: { $search: `"${search}"` } };
    }

    const allUser = await UserModel.find({ ...filter })
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .sort(sortBy);

    return allUser;
  });

  res.status(200).send({
    result: getAllUsers || [],
  });
});

// total number of user count
userRoutes.getMethod('/admin/count', async (req, res) => {
  const cacheKey = hash({
    url: req.originalUrl,
  });
  const getCount = await radiusCacheHandler(cacheKey, 5, async () => {
    const countDocument = await UserModel.estimatedDocumentCount();
    return {
      count: countDocument,
      countInternationalSystem:
        convertToInternationalCurrencySystem(countDocument),
    };
  });
  res.status(200).send({
    result: getCount,
  });
});

// get user by email
userRoutes.getMethod('/userEmail/:mail', async (req, res) => {
  const { mail } = req.params;
  const getSingleUser = await UserModel.findOne({ email: mail }).select('-__v');

  if (!getSingleUser) {
    throw new Error('User not found');
  }
  res.status(200).send({
    result: getSingleUser,
  });
});

// get user by id
userRoutes.getMethod('/:id', async (req, res) => {
  const { id } = req.params;
  const getSingleUser = await UserModel.findById(id).select('-__v');
  if (!getSingleUser) {
    throw new BadRequestValidation('User not found');
  }
  res.status(200).send({
    result: getSingleUser,
  });
});

// create a new user
userRoutes.postMethod('/', inputValidation, async (req, res) => {
  const { body } = req;
  const getUserEmail = await UserModel.findOne({ email: body.email }).select(
    'id'
  );
  if (getUserEmail) {
    throw new Error('User already Exist');
  }
  const userCreate = await createUser({ ...body });

  await createKafkaProducerSend(kafkaClientConfig, {
    topic: USER_EVENT.USER_CREATED_SINGLE,
    messages: [
      {
        value: JSON.stringify({
          body: {
            ...userCreate['_doc'],
          },
          message: USER_EVENT.USER_CREATED_SINGLE,
          createAt: Date.now(),
        }),
      },
    ],
  });

  res.status(201).send({
    result: userCreate,
  });
});

// create Activity
userRoutes.getMethod('/activity/:id', async (req, res) => {
  await createKafkaProducerSend(kafkaClientConfig, {
    topic: USER_EVENT.USER_ACTIVATE_CREATE,
    messages: [
      {
        value: JSON.stringify({
          body: {
            user: req.params.id,
            device: { ...req.device },
            requestTime: Date.now(),
          },
          message: USER_EVENT.USER_UPDATED_SINGLE,
          createAt: Date.now(),
        }),
      },
    ],
  });

  res.status(200).send({
    result: 'ok',
  });
});

// update user by id
userRoutes.postMethod('/:id', async (req, res) => {
  const userUpdate = await updateUserInfo(req.params.id, req.body);

  if (!userUpdate) {
    throw new BadRequestValidation('User not found');
  }

  // event send
  await createKafkaProducerSend(kafkaClientConfig, {
    topic: USER_EVENT.USER_UPDATED_SINGLE,
    messages: [
      {
        value: JSON.stringify({
          body: {
            ...userUpdate['_doc'],
          },
          message: USER_EVENT.USER_UPDATED_SINGLE,
          createAt: Date.now(),
        }),
      },
    ],
  });

  res.status(200).send({
    result: userUpdate,
  });
});

// delete user by id
userRoutes.deleteMethod('/:id', async (req, res) => {
  const deleteUser = await UserModel.findByIdAndDelete(req.params.id);

  if (!deleteUser) {
    throw new BadRequestValidation('User not found');
  }

  await createKafkaProducerSend(kafkaClientConfig, {
    topic: USER_EVENT.USER_DELETED_SINGLE,
    messages: [
      {
        value: JSON.stringify({
          body: {
            deleteId: req.params.id,
          },
          message: USER_EVENT.USER_DELETED_SINGLE,
          createAt: Date.now(),
        }),
      },
    ],
  });

  res.status(200).send({
    message: 'delete successfully',
  });
});

// get aggregation by country
userRoutes.getMethod('/agg/all/:fieldName', async (req, res) => {
  const { fieldName } = req.params;
  const cacheKey = hash({
    url: req.originalUrl,
  });
  const cacheTime = 10;
  const returnData = await radiusCacheHandler(cacheKey, cacheTime, async () => {
    const agg = await UserModel.aggregate([
      {
        $group: {
          _id: `$${fieldName}`,
          sum: { $sum: 1 },
        },
      },
      { $sort: { sum: -1 } },
      { $count: 'sum' },
    ]);
    return {
      allCountry: agg[0]?.sum || 0,
    };
  });

  res.status(200).send({
    result: returnData,
  });
});

// get aggregation by country
userRoutes.getMethod('/agg/country', async (req, res) => {
  const cacheKey = hash({
    url: req.originalUrl,
  });
  const cacheTime = 10;
  const returnData = await radiusCacheHandler(cacheKey, cacheTime, async () => {
    const agg = await UserModel.aggregate([
      {
        $group: {
          _id: `$country`,
          sum: { $sum: 1 },
        },
      },
      { $sort: { sum: -1 } },
      { $limit: 15 },
      { $addFields: { country: '$_id' } },
      { $project: { _id: 0 } },
    ]);
    return agg;
  });

  res.status(200).send({
    result: returnData,
  });
});

userRoutes.getMethod('/agg/gender', async (req, res) => {
  const cacheKey = hash({
    url: req.originalUrl,
  });
  const cacheTime = 10;
  const returnData = await radiusCacheHandler(cacheKey, cacheTime, async () => {
    // it takes 7s
    // const agg = await UserModel.aggregate([
    //   {
    //     $group: {
    //       _id: `$${fieldName}`,
    //       sum: { $sum: 1 },
    //     },
    //   },
    //   { $limit: 15 },
    //   { $sort: { sum: -1 } },
    // ]);
    const agg = await UserModel.aggregate([
      {
        $match: {
          gender: { $eq: 'male' },
        },
      },
      {
        $group: {
          _id: `$gender`,
          sum: { $count: {} },
        },
      },
      { $sort: { sum: -1 } },
    ]);

    const agg2 = await UserModel.aggregate([
      {
        $match: {
          gender: { $eq: 'female' },
        },
      },
      {
        $group: {
          _id: `$gender`,
          sum: { $count: {} },
        },
      },
      { $sort: { sum: -1 } },
    ]);
    const out = {
      male: agg[0]?.sum || 0,
      female: agg2[0]?.sum || 0,
    };
    return out;
  });

  res.status(200).send({
    result: returnData,
  });
});

userRoutes.getMethod('/agg/device', async (req, res) => {
  const cacheKey = hash({
    url: req.originalUrl,
  });
  const cacheTime = 1;
  const returnData = await radiusCacheHandler(cacheKey, cacheTime, async () => {
    const agg = await UserActivityModel.aggregate([
      {
        $facet: {
          deviceOsName: [
            {
              $group: {
                _id: `$device.os.name`,
                sum: { $sum: 1 },
              },
            },
            { $sort: { sum: -1 } },
            { $addFields: { name: '$_id' } },
            { $project: { _id: 0 } },
            { $limit: 5 },
          ],
          deviceBrowserName: [
            {
              $group: {
                _id: `$device.browser.name`,
                sum: { $sum: 1 },
              },
            },
            { $sort: { sum: -1 } },
            { $addFields: { name: '$_id' } },
            { $project: { _id: 0 } },
            { $limit: 5 },
          ],
        },
      },
    ]);

    return agg[0];
  });

  res.status(200).send({
    result: returnData,
  });
});

// get total request count
userRoutes.getMethod('/stat/count/totalRequest', async (req, res) => {
  const cacheKey = hash({
    url: req.originalUrl,
  });
  const getCount = await radiusCacheHandler(cacheKey, 2, async () => {
    const countDocument = await UserActivityModel.estimatedDocumentCount();
    return {
      count: countDocument,
      countInternationalSystem:
        convertToInternationalCurrencySystem(countDocument),
    };
  });
  res.status(200).send({
    result: getCount,
  });
});

// get top 15 user
userRoutes.getMethod('/stat/top-15-user', async (req, res) => {
  const cacheKey = hash({
    url: req.originalUrl,
  });
  const getUser = await radiusCacheHandler(cacheKey, 10, async () => {
    const agg = await UserActivityModel.aggregate([
      {
        $group: {
          _id: '$user',
          sum: { $sum: 1 },
        },
      },
      { $sort: { sum: -1 } },
      { $limit: 15 },
      { $addFields: { user: '$_id' } },
      { $project: { _id: 0 } },
    ]);
    const returnData = [];
    for (let index = 0; index < agg.length; index++) {
      const element = agg[index].user;
      const userInfo = await UserModel.findById(element).select('-__v');
      returnData.push({
        user: userInfo,
        sum: agg[index].sum,
      });
    }
    return returnData;
  });

  res.status(200).send({
    result: getUser,
  });
});

// get daily active user
userRoutes.getMethod('/stat/dau', async (req, res) => {
  const cacheKey = hash({
    url: req.originalUrl,
  });

  const dateFrom = new Date();
  const dateTo = new Date(new Date().setDate(dateFrom.getDate() + 1));

  let returnData = await UserActivityModel.aggregate([
    {
      $match: {
        requestTime: {
          $gte: new Date(
            dateFrom.getFullYear(),
            dateFrom.getMonth(),
            dateFrom.getDate()
          ),
          $lt: new Date(
            dateTo.getFullYear(),
            dateTo.getMonth(),
            dateTo.getDate()
          ),
        },
      },
    },
    {
      $group: {
        _id: {
          user: '$user',
          ymd: { $dateToString: { format: '%Y-%m-%d', date: '$requestTime' } },
        },
      },
    },
    { $group: { _id: '$_id.ymd', au: { $count: {} } } },
    { $addFields: { time: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { au: -1 } },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$au',
        },
      },
    },
    { $project: { _id: 0 } },
  ]);
  returnData = { totalDailyActiveUser: returnData[0]?.total || 0 };

  res.status(200).send({
    result: returnData,
  });
});

// get weekly active user
userRoutes.getMethod('/stat/wau', async (req, res) => {
  const cacheKey = hash({
    url: req.originalUrl,
  });

  const dateFrom = new Date();
  const dateTo = new Date(new Date().setDate(dateFrom.getDate() + 7));

  let returnData = await UserActivityModel.aggregate([
    {
      $match: {
        requestTime: {
          $gte: new Date(
            dateFrom.getFullYear(),
            dateFrom.getMonth(),
            dateFrom.getDate()
          ),
          $lt: new Date(
            dateTo.getFullYear(),
            dateTo.getMonth(),
            dateTo.getDate()
          ),
        },
      },
    },
    {
      $group: {
        _id: {
          user: '$user',
          ymd: { $dateToString: { format: '%Y-%m-%d', date: '$requestTime' } },
        },
      },
    },
    { $group: { _id: '$_id.ymd', au: { $count: {} } } },
    { $addFields: { time: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { au: -1 } },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$au',
        },
      },
    },
    { $project: { _id: 0 } },
  ]);
  returnData = { totalWeeklyActiveUser: returnData[0]?.total || 0 };

  res.status(200).send({
    result: returnData,
  });
});

// get weekly active user
userRoutes.getMethod('/stat/mau', async (req, res) => {
  const cacheKey = hash({
    url: req.originalUrl,
  });

  const dateFrom = new Date();
  const dateTo = new Date(new Date().setDate(dateFrom.getDate() + 31));

  let returnData = await UserActivityModel.aggregate([
    {
      $match: {
        requestTime: {
          $gte: new Date(dateFrom.getFullYear(), dateFrom.getMonth()),
          $lt: new Date(dateTo.getFullYear(), dateTo.getMonth()),
        },
      },
    },
    {
      $group: {
        _id: {
          user: '$user',
          ymd: { $dateToString: { format: '%Y-%m-%d', date: '$requestTime' } },
        },
      },
    },
    { $group: { _id: '$_id.ymd', au: { $count: {} } } },
    { $addFields: { time: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { au: -1 } },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$au',
        },
      },
    },
    { $project: { _id: 0 } },
  ]);
  returnData = { totalMonthlyActiveUser: returnData[0]?.total || 0 };

  res.status(200).send({
    result: returnData,
  });
});

export { userRoutes };
