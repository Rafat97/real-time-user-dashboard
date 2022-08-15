import { matchRoutes, useLocation } from 'react-router-dom';
import { APP_ROUTERS } from '../constent/router.const';

const routes = [
  ...Object.values(APP_ROUTERS).map((data) => ({
    path: data,
  })),
];

export const useCurrentPath = () => {
  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location);

  return route.path;
};
