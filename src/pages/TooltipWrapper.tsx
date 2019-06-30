
import * as React from 'react';
import TooltipWrapper from '@samoyed/tooltip-wrapper';
import Page from '@samoyed/page';
import { RouteComponentProps } from '@samoyed/router';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';

export default class TooltipWrapperPage extends React.Component<RouteComponentProps> {
  render() {
    return (
      <Page
        className="tooltip-page"
        scrollable="vertical"
        last={this.props.last}
        active={this.props.active}
      >
        <h1>Tooltip Wrapper</h1>

        <h2>Tooltip</h2>
        <div className="demo">
          <div className="preview">
            <TooltipWrapper tooltip="Tooltip">
              <button className="btn btn-primary mr-2">Top</button>
            </TooltipWrapper>
            <TooltipWrapper placement="right" tooltip="Tooltip">
              <button className="btn btn-primary mr-2">Right</button>
            </TooltipWrapper>
            <TooltipWrapper placement="bottom" tooltip="Tooltip">
              <button className="btn btn-primary mr-2">Bottom</button>
            </TooltipWrapper>
            <TooltipWrapper placement="left" tooltip="Tooltip">
              <button className="btn btn-primary">Left</button>
            </TooltipWrapper>
          </div>
          <SyntaxHighlighter style={docco}>{`
<div className="preview">
  <TooltipWrapper tooltip="Tooltip">
    <button className="btn btn-primary mr-2">Top</button>
  </TooltipWrapper>
  <TooltipWrapper placement="right" tooltip="Tooltip">
    <button className="btn btn-primary mr-2">Right</button>
  </TooltipWrapper>
  <TooltipWrapper placement="bottom" tooltip="Tooltip">
    <button className="btn btn-primary mr-2">Bottom</button>
  </TooltipWrapper>
  <TooltipWrapper placement="left" tooltip="Tooltip">
    <button className="btn btn-primary">Left</button>
  </TooltipWrapper>
</div>
          `}</SyntaxHighlighter>
        </div>

      </Page>
    );
  }
}
