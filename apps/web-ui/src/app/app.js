import './app.scss';
import { Route, Routes } from 'react-router-dom';
import { NavbarSimple } from './components/Navbar/index.component';

import UserPage from './page/user.page';
import DashboardPage from './page/dashboard.page';
import UserEditPage from './page/userEdit.page';
import { APP_ROUTERS } from './constent/router.const';

export function App() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div>
          <NavbarSimple />
        </div>
        <Routes>
          <Route
            path={APP_ROUTERS.DASHBOARD_PATH}
            element={<DashboardPage />}
          />
          <Route
            path={APP_ROUTERS.USER_INFO_EDIT_PATH}
            element={<UserEditPage />}
          />
          <Route
            path={APP_ROUTERS.USER_TABLE_PATH}
            element={
              <UserPage />
              // <div>
              //   <div>
              //     <div>
              //       <p>Connected: {'' + isConnected}</p>
              //       <p>Last pong: {lastPong || '-'}</p>
              //       <button onClick={sendPing}>Send ping</button>
              //     </div>
              //     <TableSelection data={[]} />
              //     <MDrawer />
              //   </div>
              // </div>
            }
          />
        </Routes>
      </div>
      {/* <Button>Click me!</Button> */}

      {/* <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes> */}
      {/* END: routes */}
    </>
  );
}
export default App;
