import { JsonSchemaRequestValidationError } from '@rafat97/exceptionhandler';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv();
addFormats(ajv);

const UserInputValidationSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string' },
    phoneNumber: { type: 'string' },
    gender: { type: 'string' },
  },
  required: ['email', 'name', 'phoneNumber', 'gender'],
};

const validate = ajv.compile(UserInputValidationSchema);

export const userInputValidation = (body) => {
  const valid = validate(body);
  if (!valid) throw new JsonSchemaRequestValidationError(validate.errors);
  return true;
};
