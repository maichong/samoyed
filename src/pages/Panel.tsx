
import * as React from 'react';
import { Placement, Colors } from '@samoyed/types';
import Page from '@samoyed/page';
import Box from '@samoyed/box';
import Panel from '@samoyed/panel';
import Switch from '@samoyed/switch';
import Checkbox from '@samoyed/checkbox';
import { RouteComponentProps } from '@samoyed/router';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';
import options from './options';

interface State {
  headerPlacement: Placement;
  color: Colors;
  border: boolean;
}

export default class PanelPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      headerPlacement: 'top',
      color: 'light',
      border: true
    };
  }

  render() {
    const { headerPlacement, color, border } = this.state;
    return (
      <Page
        className="panel-page"
        scrollable="vertical"
        last={this.props.last}
        active={this.props.active}
      >
        <h1>Panel</h1>

        <div className="demo">
          <div className="preview mt-2">
            <Panel
              icon="list"
              title="Panel Title"
              border={border}
              color={color}
              headerPlacement={headerPlacement}
              tools={[{
                icon: 'cog',
                tooltip: 'Settings',
                onClick: () => console.log('Settings')
              }, {
                icon: 'times',
                color: 'danger'
              }]}
            >
              <Box height="200px">Panel Body</Box>
            </Panel>
            <Switch
              className="mr-2 mt-2"
              options={[
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
              ]}
              value={headerPlacement}
              onChange={(v) => this.setState({ headerPlacement: v })}
            />
            <Switch
              className="mr-2 mt-2"
              options={options}
              value={color}
              onChange={(v) => this.setState({ color: v })}
            />
            <Checkbox
              label="Border"
              value={border}
              onChange={(v) => this.setState({ border: v })}
            />
          </div>
          <SyntaxHighlighter style={docco}>{`
<Panel icon="list" title="Panel Title" headerPlacement="${headerPlacement}" color="${color}" ${border ? 'border ' : ''}>
  <Box height="100px">Panel Body</Box>
</Panel>
          `}</SyntaxHighlighter>
        </div>

      </Page>
    );
  }
}
