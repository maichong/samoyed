
import * as React from 'react';
import * as _ from 'lodash';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import pages from './pages';

type Props = {
};

type State = {
};

export default class App extends React.Component<Props, State> {
  render() {
    return (
      <div className="">
        <div className="list-group menu">
          {
            _.map(pages, (C, key) => (<a
              key={key}
              href={'#/' + key}
              className="list-group-item list-group-item-action"
            >{key}</a>))
          }
        </div>
        <div className="page-content">
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
        </div>
      </div>
    );
  }
}
