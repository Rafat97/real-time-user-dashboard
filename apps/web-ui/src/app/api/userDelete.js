import axios from 'axios';
import { getUserApiBaseUrl } from '../utils/baseUrl';

export const userDeleteApiCall = async (id) => {
  try {
    let url = `${getUserApiBaseUrl()}/v1/user/${id}`;
    const config = {
      method: 'delete',
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
