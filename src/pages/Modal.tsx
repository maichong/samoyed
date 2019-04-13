
import * as React from 'react';
import ModalContainer, { alert, confirm, prompt } from '@samoyed/modal';
import Page from '@samoyed/page';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';
import options from './options';

type State = {
  value: string;
  clearable: string;
  multi: string[];
};

export default class SelectPage extends React.Component<{}, State> {
  state = {
    value: 'primary',
    clearable: 'primary',
    multi: ['primary', 'success']
  };

  render() {
    return (
      <Page className="model-page" scrollable="vertical">
        <h1>Modal</h1>

        <h2>alert</h2>
        <div className="demo">
          <div className="preview">
            <button className="btn btn-primary" onClick={() => alert('title', 'body')}>alert</button>
          </div>
          <SyntaxHighlighter style={docco}>{"alert('title', 'body')"}</SyntaxHighlighter>
        </div>

        <h2>confirm</h2>
        <div className="demo">
          <div className="preview">
            <button className="btn btn-primary" onClick={() => confirm('confirm?')}>confirm</button>
          </div>
          <SyntaxHighlighter style={docco}>{"confirm('confirm?')"}</SyntaxHighlighter>
        </div>

        <h2>prompt</h2>
        <div className="demo">
          <div className="preview">
            <button className="btn btn-primary" onClick={() => prompt('Input a value')}>prompt</button>
          </div>
          <SyntaxHighlighter style={docco}>{"prompt('Input a value')"}</SyntaxHighlighter>
        </div>

        <h2>overlap</h2>
        <div className="demo">
          <div className="preview">
            <button
              className="btn btn-primary"
              onClick={() => alert(
                'alert 1',
                <div
                  className="btn btn-success"
                  onClick={() => alert('alert 2')}
                >alert another</div>
              )}>alert</button>
          </div>
          <SyntaxHighlighter style={docco}>{`
alert(
  'alert 1',
  <div
    className="btn btn-success"
    onClick={() => alert('alert 2')}
  >alert another</div>
)
          `}</SyntaxHighlighter>
        </div>

        <ModalContainer />

      </Page>
    );
  }
}
