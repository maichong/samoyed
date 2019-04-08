
import * as React from 'react';
import * as _ from 'lodash';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Box from '@samoyed/box';
import Viewport from '@samoyed/viewport';
import pages from './pages';

type Props = {
};

type State = {
};

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
          <Router>
            <Switch>
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
