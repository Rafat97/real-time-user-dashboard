import { userInputValidation } from '@myapp/app-input-validator';

export const inputValidation = (req, res, next) => {
  const { body } = req;
  const isValid = userInputValidation(body);
  if (isValid) {
    next();
  }
};
