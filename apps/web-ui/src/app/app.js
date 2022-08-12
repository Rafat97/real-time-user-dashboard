import './app.scss';
import { Route, Routes, Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import { NavbarSimple } from './components/Navbar/index.component';
import { TableSelection } from './components/Table/index.component';

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
            path="/"
            element={
              <div>
                <TableSelection data={[]} />
              </div>
            }
          />
          <Route
            path="/users"
            element={
              <div>
                <Link to="/">Click here to go back to root page.</Link>
              </div>
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
