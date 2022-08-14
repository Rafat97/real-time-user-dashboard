import { ExpressApplicationRouter } from '@rafat97/express-made-easy';
import { createKafkaProducerSend } from '@myapp/utils';
import { USER_EVENT } from '@myapp/event';
import { BadRequestValidation } from '@rafat97/exceptionhandler';
import { createUser, updateUserInfo, UserModel } from '@myapp/app-models';
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

    const allUser = await UserModel.find({})
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

export { userRoutes };
