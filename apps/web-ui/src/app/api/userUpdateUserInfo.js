import axios from 'axios';

export const updateUserInfoApiCall = async (userInput) => {
  const id = userInput._id;
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/user/${id}`;
  const input = JSON.stringify({
    ...userInput,
  });
  const config = {
    method: 'post',
    url: url,
    headers: { 'Content-Type': 'application/json' },
    data: userInput,
  };
  const data = await axios(config);
  return data.data.result;
};
