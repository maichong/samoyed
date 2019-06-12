
import * as React from 'react';
import { Placement } from '@samoyed/types';
import Page from '@samoyed/page';
import Box, { ScrollData } from '@samoyed/box';
import Switch from '@samoyed/switch';
import { RouteComponentProps } from '@samoyed/router';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';

interface State {
  rect?: ClientRect;
  dockPlacement: Placement;
  scroll: Partial<ScrollData>;
  reachEvent: string[];
}

export default class CheckboxPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      dockPlacement: 'top',
      scroll: {
      },
      reachEvent: []
    };
  }

  render() {
    const { rect, scroll } = this.state;
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

        <h2>dock</h2>
        <div className="demo">
          <div className="preview">
            <Box layout="horizontal" dock={<Box bodyClassName="bg-info">Title</Box>} dockPlacement={this.state.dockPlacement}>
              <Box bodyClassName="bg-success">Green</Box>
              <Box bodyClassName="bg-danger" flex>Red</Box>
            </Box>
            <Switch
              className="mt-2"
              options={[
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
              ]}
              value={this.state.dockPlacement}
              onChange={(v) => this.setState({ dockPlacement: v })}
            />
          </div>
          <SyntaxHighlighter style={docco}>{`
<Box 
  layout="horizontal"
  dock={<Box bodyClassName="bg-info">Title</Box>}
  dockPlacement="${this.state.dockPlacement}"
>
  <Box>Green</Box>
  <Box flex>Red</Box>
</Box>
          `}</SyntaxHighlighter>
        </div>

        <h2>onResize</h2>
        <div className="demo">
          <div className="preview">
            <Box onResize={(r) => this.setState({ rect: r })}>
              <div className="p-2 bg-info">Box</div>
            </Box>
            {rect && <div>Width: {rect.width}</div>}
            {rect && <div>Height: {rect.height}</div>}
            {rect && <div>Left: {rect.left}</div>}
            {rect && <div>Top: {rect.top}</div>}
          </div>
          <SyntaxHighlighter style={docco}>{'<Box onResize={(rect) => this.setState({ rect })}></Box>'}</SyntaxHighlighter>
        </div>

        <h2>onBodyScroll</h2>
        <div className="demo">
          <div className="preview">
            <Box onBodyScroll={(data) => this.setState({ scroll: data })} scrollable="vertical" style={{ height: 100 }}>
              <div className="bg-light">
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
              </div>
            </Box>
            <div>clientHeight: {scroll.clientHeight}</div>
            <div>clientWidth: {scroll.clientWidth}</div>
            <div>scrollHeight: {scroll.scrollHeight}</div>
            <div>scrollWidth: {scroll.scrollWidth}</div>
            <div>scrollTop: {scroll.scrollTop}</div>
            <div>scrollLeft: {scroll.scrollLeft}</div>
          </div>
          <SyntaxHighlighter style={docco}>{'<Box scrollable="vertical" onBodyScroll={(scroll) => this.setState({ scroll })}></Box>'}</SyntaxHighlighter>
        </div>

        <h2>onReachBottom</h2>
        <div className="demo">
          <div className="preview">
            <Box
              scrollable="vertical"
              style={{ height: 100 }}
              onReachBottom={() => this.setState({ reachEvent: ['onReachBottom'].concat(this.state.reachEvent) })}
            >
              <div className="bg-light">
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
                <div className="p-2">Box</div>
              </div>
            </Box>
            {this.state.reachEvent.map((text, i) => <div key={i}>{text}</div>)}
          </div>
          <SyntaxHighlighter style={docco}>{'<Box scrollable="vertical" onReachBottom={this.loadMore}></Box>'}</SyntaxHighlighter>
        </div>
      </Page>
    );
  }
}
