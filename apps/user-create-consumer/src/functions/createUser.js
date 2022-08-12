import { faker } from '@faker-js/faker';
import { UserModel } from '@myapp/app-models';

export const createRandomUser = async (message) => {
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
        const name = faker.name.fullName();
        const email = `${Date.now()}_random_${uniqueCounter}@test.com`;
        const phoneNumber = faker.phone.number();
        const userData = {
          name,
          email,
          phoneNumber,
          test: email,
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
  try {
    let doc = await UserModel.create(message);
    console.log(doc);
  } catch (error) {
    console.log('-----------------createUser------------');
    console.log(error);
    console.log('-----------------createUser------------');
  }
};
