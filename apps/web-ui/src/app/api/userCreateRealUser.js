import axios from 'axios';
import { getUserApiBaseUrl } from '../utils/baseUrl';

export const createRealApiCall = async (userInput) => {
  let url = `${getUserApiBaseUrl()}/v1/user`;
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
