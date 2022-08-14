import axios from 'axios';

export const userDeleteApiCall = async (id) => {
  try {
    let url = `${
      process.env.API_USER_URL || `http://localhost:9000`
    }/v1/user/${id}`;
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
