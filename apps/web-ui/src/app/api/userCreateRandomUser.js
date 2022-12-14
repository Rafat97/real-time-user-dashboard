import axios from 'axios';
import { getUserApiBaseUrl } from '../utils/baseUrl';

export const createRandomUserApiCall = async (numberOfUser = 0) => {
  let url = `${getUserApiBaseUrl()}/v1/generate/users/random/${numberOfUser}`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};
