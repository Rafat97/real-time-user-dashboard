import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { convertToInternationalCurrencySystem } from '@myapp/utils';

export const UserModelRef = 'User';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    country: {
      type: String,
      index: true,
    },
    gender: {
      type: String,
      required: true,
      index: true,
    },
    avatar: {
      type: String,
      default: 'https://i.pravatar.cc/150',
    },
    userName: {
      type: String,
      index: true,
      default: ulid(),
    },
    lastActive: {
      type: Date,
      index: true,
      default: Date.now(),
    },
  },
  { timestamps: true, strict: false }
);
UserSchema.index({ createdAt: 1 });
UserSchema.index({ updatedAt: 1 });
UserSchema.index({ country: -1 });
UserSchema.index({ '$**': 'text' });
export const UserModel = mongoose.model(UserModelRef, UserSchema);

export const createRandomUser = async (message) => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  try {
    const totalUser = message.totalUserCreate || 1;
    let counter = totalUser;
    let uniqueCounter = 0;
    while (counter > 0) {
      let userAdd = [];
      let currentCounter = 1000;
      if (counter <= 1000) {
        currentCounter = counter;
      }
      for (let index2 = 0; index2 < currentCounter; index2++) {
        uniqueCounter += 1;
        const uid = ulid();
        const genderArray = ['male', 'female'];
        const gender = genderArray[getRandomInt(2)];
        const name = faker.name.fullName({ sex: gender });
        const email = `${Date.now()}_random_${uniqueCounter}@test.com`;
        const phoneNumber = faker.phone.number();
        const country = faker.address.country();

        const userData = {
          email,
          name,
          phoneNumber,
          country,
          gender,
          userName: uid,
          lastActive: Date.now(),
        };
        userAdd.push(userData);
      }
      await UserModel.create(userAdd);
      counter = counter - currentCounter;
    }
  } catch (error) {
    console.log('-----------------createRandomUser------------');
    console.log(error);
    console.log('-----------------createRandomUser------------');
  }
};

export const createUser = async (message) => {
  const uid = ulid();
  const data = { ...message, lastActive: Date.now(), userName: uid };
  let doc = await UserModel.create(data);
  console.log(doc);
  return doc;
};

export const updateUserInfo = async (id, body) => {
  const userUpdate = await UserModel.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  return userUpdate;
};

export const getGenderAggregation = async () => {
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
};

export const getUserCountryAggregation = async () => {
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
};

export const getUserEstimateCounter = async () => {
  const countDocument = await UserModel.estimatedDocumentCount();
  return {
    count: countDocument,
    countInternationalSystem:
      convertToInternationalCurrencySystem(countDocument),
  };
};
