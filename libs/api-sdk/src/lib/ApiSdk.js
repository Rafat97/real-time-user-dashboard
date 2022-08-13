import axios from 'axios';
export const getAllUserApiCall = async (options) => {
  let url =
    (process.env.APP_USER_API_URL || `http://localhost:9000`) + `/v1/user`;
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
};

export const getTotalUserCount = async () => {
  let url =
    (process.env.APP_USER_API_URL || `http://localhost:9000`) +
    `/v1/user/admin/count`;

  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data;
};
