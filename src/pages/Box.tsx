
import * as React from 'react';
import Checkbox from '@samoyed/checkbox';
import Page from '@samoyed/page';
import Box from '@samoyed/box';
import { RouteComponentProps } from '@samoyed/router';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';

type State = {
  rect?: ClientRect;
};

export default class CheckboxPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { rect } = this.state;
    return (
      <Page
        className="box-page"
        scrollable="vertical"
        previous={this.props.previous}
        last={this.props.last}
        active={this.props.active}
      >
        <h1>Box</h1>

        <h2>className / bodyClassName</h2>
        <div className="demo">
          <div className="preview">
            <Box className="bg-primary p-2" bodyClassName="bg-success">Box</Box>
          </div>
          <SyntaxHighlighter style={docco}>{'<Box className="bg-primary p-2" bodyClassName="bg-success"></Box>'}</SyntaxHighlighter>
        </div>

        <h2>flex</h2>
        <div className="demo">
          <div className="preview">
            <Box layout="horizontal">
              <Box bodyClassName="bg-success">Green</Box>
              <Box bodyClassName="bg-danger" flex>Red</Box>
            </Box>
          </div>
          <SyntaxHighlighter style={docco}>{`
<Box layout="horizontal">
  <Box>Green</Box>
  <Box flex>Red</Box>
</Box>
          `}</SyntaxHighlighter>
        </div>

        <h2>onResize</h2>
        <div className="demo">
          <div className="preview">
            <Box onResize={(rect) => this.setState({ rect })}>
              <div className="p-2 bg-info">Box</div>
            </Box>
            {rect && <div>Width: {rect.width}</div>}
            {rect && <div>Height: {rect.height}</div>}
            {rect && <div>Left: {rect.left}</div>}
            {rect && <div>Top: {rect.top}</div>}
          </div>
          <SyntaxHighlighter style={docco}>{'<Box onResize={(rect) => this.setState({ rect })}></Box>'}</SyntaxHighlighter>
        </div>
      </Page>
    );
  }
}
