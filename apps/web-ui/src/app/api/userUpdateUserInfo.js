import axios from 'axios';
import { getUserApiBaseUrl } from '../utils/baseUrl';

export const updateUserInfoApiCall = async (userInput) => {
  const id = userInput._id;
  let url = `${getUserApiBaseUrl()}/v1/user/${id}`;
  const input = JSON.stringify({
    ...userInput,
  });
  const config = {
    method: 'post',
    url: url,
    headers: { 'Content-Type': 'application/json' },
    data: input,
  };
  const data = await axios(config);
  return data.data.result;
};
