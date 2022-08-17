import { convertToInternationalCurrencySystem } from '@myapp/utils';
import mongoose, { Schema } from 'mongoose';
import { updateUserInfo, UserModel, UserModelRef } from './User';

const UserActivitySchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: UserModelRef, require: true },
    requestTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, strict: false }
);
UserActivitySchema.index({ '$**': 'text' });
UserActivitySchema.index({ createdAt: 1 });
UserActivitySchema.index({ createdAt: -1 });
UserActivitySchema.index({ updatedAt: 1 });
UserActivitySchema.index({ updatedAt: -1 });
UserActivitySchema.index({ requestTime: -1 });
UserActivitySchema.index({ requestTime: 1 });
export const UserActivityModel = mongoose.model(
  'UserActivity',
  UserActivitySchema
);

export const createUserActivate = async (message) => {
  try {
    let doc = await UserActivityModel.create(message);
    console.log(doc);
    let updateUser = await updateUserInfo(message.user, {
      lastActive: message.requestTime,
    });
    console.log(updateUser);
  } catch (error) {
    console.log('-----------------createUser------------');
    console.log(error);
    console.log('-----------------createUser------------');
  }
};

export const deleteUserActivate = async (user) => {
  try {
    let doc = await UserActivityModel.deleteMany({
      user: user,
    });
    console.log(doc);
  } catch (error) {
    console.log('-----------------createUser------------');
    console.log(error);
    console.log('-----------------createUser------------');
  }
};

export const getUserActivateDeviceAggregation = async () => {
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
};

export const getUserActivateCounter = async () => {
  const countDocument = await UserActivityModel.estimatedDocumentCount();
  return {
    count: countDocument,
    countInternationalSystem:
      convertToInternationalCurrencySystem(countDocument),
  };
};

export const getTop15Users = async () => {
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
};

export const getDailyActiveUser = async (startDate) => {
  let dateFrom = new Date();

  if (startDate) {
    dateFrom = new Date(startDate);
  }
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
  return returnData;
};

export const getWeeklyActiveUser = async (startDate) => {
  let dateFrom = new Date();

  if (startDate) {
    dateFrom = new Date(startDate);
  }

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
  return returnData;
};

export const getMonthActiveUser = async (startDate) => {
  let dateFrom = new Date();

  if (startDate) {
    dateFrom = new Date(startDate);
  }

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
  return returnData;
};
