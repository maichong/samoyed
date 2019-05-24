
import * as React from 'react';
import Page from '@samoyed/page';
import Box from '@samoyed/box';
import { Switch, Route, Link, Redirect, RouteComponentProps } from '@samoyed/router';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';

function Page1(props: any) {
  return (
    <Box
      previous={props.previous}
      last={props.last}
      active={props.active}
      className="bg-info"
    >Page 1</Box>
  );
}

function Page2(props: any) {
  return (
    <Box
      previous={props.previous}
      last={props.last}
      active={props.active}
      className="bg-warning"
    >Page 2</Box>
  );
}

function Page3(props: any) {
  return (
    <Box
      previous={props.previous}
      last={props.last}
      active={props.active}
      className="bg-success"
    >Page 3</Box>
  );
}

export default class RouterPage extends React.Component<RouteComponentProps> {
  render() {
    const { router } = this.props;
    return (
      <Page
        className="router-page"
        previous={this.props.previous}
        last={this.props.last}
        active={this.props.active}
      >
        <h1>Router</h1>

        <div className="demo">
          <div className="preview">
            <Box className="mb-2" layout="horizontal">
              {router.entries.length > 1 && <a className="s-link" onClick={() => router.history.goBack()}>Back</a>}
              <div className="s-flex"></div>
              <Link to="/Router/page1">page 1</Link>
              <Link to="/Router/page2" className="ml-2">page 2</Link>
              <Link to="/Router/page3" className="ml-2">page 3</Link>
            </Box>

            <Box style={{ height: 100 }} layout="fit">
              <Switch animation={{ type: 'slide' }}>
                <Route path="/Router/page1" component={Page1} historyLimit={2} />
                <Route path="/Router/page2" component={Page2} historyLimit={2} />
                <Route path="/Router/page3" component={Page3} historyLimit={2} />
                <Redirect to="/Router/page1" />
              </Switch>
            </Box>
          </div>
          <SyntaxHighlighter style={docco}>{`
<Router history={history}>
  <Box flex layout="fit">
    <Switch animation={{ type: 'slide' }}>
      <Route path="/page1" component={Page1} />
      <Route path="/page2" component={Page2} />
      <Route path="/page3" component={Page3} />
      <Redirect to="/page1" />
    </Switch>
  </Box>
</Router>
          `}</SyntaxHighlighter>
        </div>

      </Page>
    );
  }
}
