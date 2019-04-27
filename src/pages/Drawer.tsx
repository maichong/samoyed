
import * as React from 'react';
import Box from '@samoyed/box';
import Drawer, { Placement, Mode } from '@samoyed/drawer';
import Page from '@samoyed/page';
import Switch from '@samoyed/switch';
import { RouteComponentProps } from '@samoyed/router';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';

interface State {
  show: boolean;
  placement: Placement;
  mode: Mode;
}

export default class CheckboxPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      show: false,
      placement: 'top',
      mode: 'slide'
    };
  }

  render() {
    return (
      <Drawer
        show={this.state.show}
        mode={this.state.mode}
        placement={this.state.placement}
        onHide={() => this.setState({ show: false })}
        onShow={() => this.setState({ show: true })}
        drawer={<div className="drawer-content">drawer</div>}
      >

        <Page
          className="drawer-page"
          scrollable="vertical"
          previous={this.props.previous}
          last={this.props.last}
          active={this.props.active}
        >
          <h1>Drawer</h1>

          <div className="demo">
            <div className="preview">
              <Switch
                className="ml-2"
                options={[
                  { label: 'Left', value: 'left' },
                  { label: 'Right', value: 'right' },
                  { label: 'Top', value: 'top' },
                  { label: 'Bottom', value: 'bottom' },
                ]}
                value={this.state.placement}
                onChange={(v) => this.setState({ placement: v })}
              />
              <Switch
                className="ml-2"
                options={[
                  { label: 'Cover', value: 'cover' },
                  { label: 'Slide', value: 'slide' },
                ]}
                value={this.state.mode}
                onChange={(v) => this.setState({ mode: v })}
              />
              <Switch
                className="ml-2"
                options={[
                  { label: 'Show', value: true },
                  { label: 'Hide', value: false },
                ]}
                value={this.state.show}
                onChange={(v) => this.setState({ show: v })}
              />
            </div>
            <SyntaxHighlighter style={docco}>{`
<Drawer 
  show={${this.state.show}}
  placement="${this.state.placement}"
  mode="${this.state.mode}"
  drawer={<div>Drawer content</div>}
>
  <Page>Page Content</Page>
</Box>
  `}</SyntaxHighlighter>
          </div>
        </Page>
      </Drawer>
    );
  }
}
