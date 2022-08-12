import mongoose from 'mongoose';

export const mongoDBConnectionCheck = (
  connecTionString,
  callbackSuccess,
  callbackError
) => {
  mongoose
    .connect(connecTionString)
    .then(() => {
      console.log(connecTionString);
      console.log('MongoDB connected successfully');
      callbackSuccess();
    })
    .catch((error) => {
      console.log(connecTionString);
      console.log(
        '%s MongoDB connection error. Please make sure MongoDB is running.',
        '✗'
      );
      console.log(error);
      callbackError();
    });
};

export const mongoDBConnectionCheckSync = async (connecTionString) => {
  let isConnected = true;
  try {
    await mongoose.connect(connecTionString);
    console.log(connecTionString);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log(connecTionString);
    console.log(
      '%s MongoDB connection error. Please make sure MongoDB is running.',
      '✗'
    );
    isConnected = false;
    console.log(error);
  }
  return isConnected;
};

/**
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 *
 * https://mongoosejs.com/docs/api/connection.html#connection_Connection-readyState
 *
 */
export const mongoDBStatusCheck = () => {
  const readyState = mongoose.connection.readyState;
  if (readyState === 0) {
    return 'MONGO_DISCONNECTED';
  } else if (readyState === 1) {
    return 'MONGO_CONNECTED';
  } else if (readyState === 2) {
    return 'MONGO_CONNECTING';
  } else if (readyState === 3) {
    return 'MONGO_DISCONNECTING';
  } else {
    return 'MONGO_UNKNOWN_READYSTATE_' + readyState;
  }
};
