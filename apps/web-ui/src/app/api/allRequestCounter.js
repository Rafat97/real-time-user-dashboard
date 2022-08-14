import axios from 'axios';
export const allRequestCounterApiCall = async () => {
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/user/stat/count/totalRequest`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};
