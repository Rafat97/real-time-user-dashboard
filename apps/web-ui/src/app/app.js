import './app.scss';
import { Route, Routes, Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import { NavbarSimple } from './components/Navbar/index.component';
import { TableSelection } from './components/Table/index.component';
import { MDrawer } from './components/Drawer/index.component';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io("ws://localhost:8000");

export function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendPing = () => {
    socket.emit('ping');
  };

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
                <div>asdasd</div>
              </div>
            }
          />
          <Route
            path="/users"
            element={
              <div>
                <div>
                  <div>
                    <p>Connected: {'' + isConnected}</p>
                    <p>Last pong: {lastPong || '-'}</p>
                    <button onClick={sendPing}>Send ping</button>
                  </div>
                  <TableSelection data={[]} />
                  <MDrawer />
                </div>
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
