
import * as React from 'react';
import * as _ from 'lodash';
import * as H from 'history';
import { Router, Switch, Route, Redirect, NavLink } from '@samoyed/router';
import Box from '@samoyed/box';
import Viewport from '@samoyed/viewport';
import pages from './pages';

type Props = {
};

type State = {
};

const history = H.createHashHistory();

export default class App extends React.Component<Props, State> {
  render() {
    return (
      <Viewport className="" layout="horizontal">
        <Router history={history} freeComponent="keepalive">
          <Box className="list-group menu">
            {
              _.map(pages, (C, key) => (<NavLink
                key={key}
                to={`/${key.replace(' ', '-')}`}
                className="list-group-item list-group-item-action"
              >{key}</NavLink>))
            }
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
              <Redirect to="/Checkbox" />
            </Switch>
          </Box>
        </Router>
      </Viewport>
    );
  }
}
