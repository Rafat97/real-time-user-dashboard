import axios from 'axios';
import { getUserApiBaseUrl } from '../utils/baseUrl';

export const userActivityApiCall = async (id) => {
  try {
    let url = `${getUserApiBaseUrl()}/v1/user/activity/${id}`;
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
  return {};
};
