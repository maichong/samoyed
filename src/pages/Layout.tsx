
import * as React from 'react';
import { AnimationType } from '@samoyed/types';
import Box from '@samoyed/box';
import Page from '@samoyed/page';
import Switch from '@samoyed/switch';
import { RouteComponentProps } from '@samoyed/router';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';

interface State {
  activeItem: number;
  type: AnimationType;
  direction: 'horizontal' | 'vertical';
}

const options = [{
  label: 'Red',
  value: 0
}, {
  label: 'Green',
  value: 1
}, {
  label: 'Blue',
  value: 2
}];

export default class CheckboxPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      activeItem: 0,
      type: 'slide',
      direction: 'horizontal'
    };
  }

  render() {
    return (
      <Page
        className="layout-page"
        scrollable="vertical"
        last={this.props.last}
        active={this.props.active}
      >
        <h1>Layout</h1>

        <h2>fit</h2>
        <div className="demo">
          <div className="preview">
            <Box className="layout-box" layout="fit" >
              <Box className="item bg-danger">Red</Box>
            </Box>
          </div>
          <SyntaxHighlighter style={docco}>{`
<Box layout="fit" >
  <Box>Red</Box>
</Box>
          `}</SyntaxHighlighter>
        </div>

        <h2>vertical</h2>
        <div className="demo">
          <div className="preview">
            <Box className="layout-box" layout="vertical" >
              <Box className="item bg-danger">Red</Box>
              <Box className="item bg-success">Green</Box>
              <Box className="item bg-primary" flex>Blue</Box>
            </Box>
          </div>
          <SyntaxHighlighter style={docco}>{`
<Box layout="vertical" >
  <Box>Red</Box>
  <Box>Green</Box>
  <Box flex>Blue</Box>
</Box>
          `}</SyntaxHighlighter>
        </div>

        <h2>horizontal</h2>
        <div className="demo">
          <div className="preview">
            <Box className="layout-box" layout="horizontal" >
              <Box className="item bg-danger">Red</Box>
              <Box className="item bg-success">Green</Box>
              <Box className="item bg-primary" flex>Blue</Box>
            </Box>
          </div>
          <SyntaxHighlighter style={docco}>{`
<Box layout="horizontal" >
  <Box>Red</Box>
  <Box>Green</Box>
  <Box flex>Blue</Box>
</Box>
  `}</SyntaxHighlighter>
        </div>

        <h2>card</h2>
        <div className="demo">
          <div className="preview">
            <Box
              className="layout-box mb-2"
              layout="card"
              activeItem={this.state.activeItem}
              animation={{ type: this.state.type, direction: this.state.direction }}
            >
              <Box className="item bg-danger">Red</Box>
              <Box className="item bg-success">Green</Box>
              <Box className="item bg-primary">Blue</Box>
            </Box>
            <Switch options={options} value={this.state.activeItem} onChange={(v) => this.setState({ activeItem: v })} />
            <Switch
              className="ml-2"
              options={[
                { label: 'Slide', value: 'slide' },
                { label: 'Fade', value: 'fade' },
                { label: 'Cover', value: 'cover' },
                { label: 'Cover Fade', value: 'cover-fade' },
              ]}
              value={this.state.type}
              onChange={(v) => this.setState({ type: v })}
            />
            <Switch
              className="ml-2"
              options={[
                { label: 'Vertical', value: 'vertical' },
                { label: 'Horizontal', value: 'horizontal' },
              ]}
              value={this.state.direction}
              onChange={(v) => this.setState({ direction: v })}
            />
          </div>
          <SyntaxHighlighter style={docco}>{`
<Box layout="card" activeItem={${this.state.activeItem}} animation={{ type: '${this.state.type}', direction: '${this.state.direction}'}}>
  <Box>Red</Box>
  <Box>Green</Box>
  <Box>Blue</Box>
</Box>
  `}</SyntaxHighlighter>
        </div>
      </Page>
    );
  }
}
