import axios from 'axios';
import { getUserApiBaseUrl } from '../utils/baseUrl';

export const getAllUserApiCall = async (options) => {
  try {
    let url = `${getUserApiBaseUrl()}/v1/user?`;
    for (const key in options) {
      const element = options[key];
      url += `${key}=${element}&`;
    }
    url = url.slice(0, -1);
    const config = {
      method: 'get',
      url: url,
      headers: { 'Content-Type': 'application/json' },
    };
    const data = await axios(config);
    return data;
  } catch (error) {
    alert(error.message);
  }
  return [];
};
