import axios from 'axios';

export const createRandomUserApiCall = async (numberOfUser = 0) => {
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/generate/users/random/${numberOfUser}`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};
