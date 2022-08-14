import axios from 'axios';

export const createRealApiCall = async (userInput) => {
  let url = `${process.env.API_USER_URL || `http://localhost:9000`}/v1/user`;
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
