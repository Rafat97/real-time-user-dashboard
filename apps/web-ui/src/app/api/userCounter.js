import axios from 'axios';
export const getTotalUserCounter = async () => {
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/user/admin/count`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};

export const getTotalGenderCounterApiCall = async () => {
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/user/agg/gender`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};

export const getDailyActiveUserApiCall = async () => {
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/user/stat/dau`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};

export const getWeeklyActiveUserApiCall = async () => {
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/user/stat/wau`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};

export const getMonthlyActiveUserApiCall = async () => {
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/user/stat/mau`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};

