import axios from 'axios';
import { getUserApiBaseUrl } from '../utils/baseUrl';
export const getTotalUserCounter = async () => {
  let url = `${getUserApiBaseUrl()}/v1/user/admin/count`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};

export const getTotalGenderCounterApiCall = async () => {
  let url = `${getUserApiBaseUrl()}/v1/user/agg/gender`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};

export const getDailyActiveUserApiCall = async () => {
  let url = `${getUserApiBaseUrl()}/v1/user/stat/dau`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};

export const getWeeklyActiveUserApiCall = async () => {
  let url = `${getUserApiBaseUrl()}/v1/user/stat/wau`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};

export const getMonthlyActiveUserApiCall = async () => {
  let url = `${getUserApiBaseUrl()}/v1/user/stat/mau`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};

export const getDeviceCounterApiCall = async () => {
  let url = `${getUserApiBaseUrl()}/v1/user/agg/device`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};
