
import * as React from 'react';
import * as _ from 'lodash';
import { Router, Switch, Route, Redirect, NavLink } from '@samoyed/router';
import app from '@samoyed/app';
import Box from '@samoyed/box';
import Viewport from '@samoyed/viewport';
import pages from './pages';
import RouterPage from './pages/Router';

type Props = {
};

type State = {
};

export default class App extends React.Component<Props, State> {
  render() {
    return (
      <Viewport className="" layout="horizontal">
        <Router history={app.history}>
          <Box className="list-group menu">
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
          </Box>
          <Box flex layout="fit">
            <Switch animation={{ type: 'slide' }}>
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
          </Box>
        </Router>
      </Viewport>
    );
  }
}
