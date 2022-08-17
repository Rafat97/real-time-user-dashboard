import axios from 'axios';
import { getUserApiBaseUrl } from '../utils/baseUrl';

export const userGetByIdApiCall = async (id) => {
  let url = `${getUserApiBaseUrl()}/v1/user/${id}`;

  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};
