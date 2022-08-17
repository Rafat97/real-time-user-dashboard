import axios from 'axios';
import { getUserApiBaseUrl } from '../utils/baseUrl';
export const allCountryCounterApiCall = async () => {
  let url = `${getUserApiBaseUrl()}/v1/user/agg/all/country`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  console.log(data);
  return data.data.result;
};

export const allTop15CountryCounterApiCall = async () => {
  let url = `${getUserApiBaseUrl()}/v1/user/agg/country`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  console.log(data);
  return data.data.result;
};

export const Top15UserCounterApiCall = async () => {
  let url = `${getUserApiBaseUrl()}/v1/user/stat/top-15-user`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  console.log(data);
  return data.data.result;
};
