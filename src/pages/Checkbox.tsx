
import * as React from 'react';
import Checkbox from '@samoyed/checkbox';
import Page from '@samoyed/page';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';

export default class CheckboxPage extends React.Component<{}> {
  render() {
    return (
      <Page className="checkbox-page" scrollable="vertical">
        <h1>Checkbox</h1>

        <h2>checkbox</h2>
        <div className="demo">
          <div className="preview">
            <Checkbox value={false} />
          </div>
          <SyntaxHighlighter style={docco}>{'<Checkbox value={false} />'}</SyntaxHighlighter>
        </div>
        <div className="demo">
          <div className="preview">
            <Checkbox value={true} />
          </div>
          <SyntaxHighlighter style={docco}>{'<Checkbox value={true} />'}</SyntaxHighlighter>
        </div>

        <h2>radio</h2>
        <div className="demo">
          <div className="preview">
            <Checkbox radio value={false} />
          </div>
          <SyntaxHighlighter style={docco}>{'<Checkbox radio value={false} />'}</SyntaxHighlighter>
        </div>
        <div className="demo">
          <div className="preview">
            <Checkbox radio value={true} />
          </div>
          <SyntaxHighlighter style={docco}>{'<Checkbox radio value={true} />'}</SyntaxHighlighter>
        </div>

        <h2>label</h2>
        <div className="demo">
          <div className="preview">
            <Checkbox value={true} label="Checkbox label" />
          </div>
          <SyntaxHighlighter style={docco}>{'<Checkbox value={true} label="Checkbox label"/>'}</SyntaxHighlighter>
        </div>
      </Page>
    );
  }
}
