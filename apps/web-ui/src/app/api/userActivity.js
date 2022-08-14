import axios from 'axios';

export const userActivityApiCall = async (id) => {
  try {
    let url = `${
      process.env.API_USER_URL || `http://localhost:9000`
    }/activity/${id}`;
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
