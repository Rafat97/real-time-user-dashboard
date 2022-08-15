import axios from 'axios';

export const userGetByIdApiCall = async (id) => {
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/user/${id}`;

  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};
