import * as parser from 'ua-parser-js';

export const userDeviceMiddleWare = (req, res, next) => {
  const userAgent = req.get('User-Agent');
  var device = parser(userAgent);
  req.device = device;
  next();
};
