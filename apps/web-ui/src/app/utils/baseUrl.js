export const getUserApiBaseUrl = () => {
  const url = `${
    process.env.API_USER_URL ||
    process.env.NX_API_USER_URL ||
    `http://localhost:9000`
  }`;
  return url;
};
