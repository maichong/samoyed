
import * as React from 'react';
import * as _ from 'lodash';
import * as H from 'history';
import { Router, Switch, Route } from '@samoyed/router';
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
      <Viewport className="" layout="hbox">
        <Box className="list-group menu">
          {
            _.map(pages, (C, key) => (<a
              key={key}
              href={'#/' + key}
              className="list-group-item list-group-item-action"
            >{key}</a>))
          }
        </Box>
        <Box flex>
          <Router history={history}>
            <Switch>
              <Route
                path={'/'}
                component={Box}
              />
              {
                _.map(pages, (C, key) => (<Route
                  key={key}
                  path={'/' + key}
                  component={C}
                  exact
                />))
              }
            </Switch>
          </Router>
        </Box>
      </Viewport>
    );
  }
}
