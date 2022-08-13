import axios from 'axios';
export const getTotalUserCounter = async () => {
  let url = 'http://localhost:9000/v1/user/admin/count';
  const config = {
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/json' },
  };
  const data = await axios(config);
  return data.data.result;
};
