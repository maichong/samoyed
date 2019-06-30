
import * as React from 'react';
import * as _ from 'lodash';
import { Router, Switch, Route, Redirect, NavLink } from '@samoyed/router';
import app from '@samoyed/app';
import Box from '@samoyed/box';
import Drawer from '@samoyed/drawer';
import Viewport from '@samoyed/viewport';
import pages from './pages';
import RouterPage from './pages/Router';

export default function App() {
  let [show, setShow] = React.useState(false);
  let forceUpdate = React.useState(1)[1];
  React.useEffect(() => {
    app.on('layout-change', () => {
      forceUpdate(Math.random());
    });
  }, [1]);
  return (
    <Router history={app.history}>
      <Viewport className="" layout="fit">
        <Drawer
          show={show}
          placement="left"
          mode={app.is.xs ? 'cover' : 'none'}
          onShow={() => setShow(true)}
          onHide={() => setShow(false)}
          drawer={<Box className="list-group menu">
            {
              _.map(pages, (C, key) => (<NavLink
                key={key}
                to={`/${key.replace(' ', '-')}`}
                className="list-group-item list-group-item-action"
              >{key}</NavLink>))
            }
            <NavLink
              to="/Router"
              className="list-group-item list-group-item-action"
            >Router</NavLink>
          </Box>}
        >
          <Switch animation={{ type: 'slide', duration: 1000 }}>
            {
              _.map(pages, (C, key) => (<Route
                key={key}
                path={`/${key.replace(' ', '-')}`}
                historyLimit={2}
                component={C}
                exact
              />))
            }
            <Route
              path="/Router"
              component={RouterPage}
            />
            <Redirect to="/Box" />
          </Switch>
        </Drawer>

      </Viewport>
    </Router>
  );
}
