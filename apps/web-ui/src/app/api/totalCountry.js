import axios from 'axios';
export const allCountryCounterApiCall = async () => {
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/user/agg/all/country`;
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
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/user/agg/country`;
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
  let url = `${
    process.env.API_USER_URL || `http://localhost:9000`
  }/v1/user/stat/top-15-user`;
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  console.log(data);
  return data.data.result;
};
