
import * as React from 'react';
import toast, { ToastContainer, success, error, warning, info, clear } from '@samoyed/toast';
import Page from '@samoyed/page';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';

export default class ToastPage extends React.Component<{}> {
  render() {
    return (
      <Page scrollable="y">
        <h1>Tooltip Wrapper</h1>
        <ToastContainer />

        <h2>toast</h2>
        <div className="demo">
          <div className="preview">
            <button className="btn btn-primary mr-2" onClick={() => toast('title', 'message body')}>Show</button>
          </div>
          <SyntaxHighlighter style={docco}>{`
import toast, { ToastContainer } from '@samoyed/toast';

<ToastContainer/>

toast('title', 'message body')
          `}</SyntaxHighlighter>
        </div>

        <h2>options</h2>
        <div className="demo">
          <div className="preview">
            <button
              className="btn btn-primary mr-2"
              onClick={() => toast('title', 'message body', { type: 'error', timeOut: 10000 })
              }>Show</button>
          </div>
          <SyntaxHighlighter style={docco}>{`toast('title', 'message body', { type: 'error', timeOut: 10000 })`}</SyntaxHighlighter>
        </div>

        <h2>colors</h2>
        <div className="demo">
          <div className="preview">
            <button
              className="btn btn-success mr-2"
              onClick={() => success('title', 'message body')
              }>success</button>
            <button
              className="btn btn-danger mr-2"
              onClick={() => error('title', 'message body')
              }>error</button>
            <button
              className="btn btn-warning mr-2"
              onClick={() => warning('title', 'message body')
              }>warning</button>
            <button
              className="btn btn-info mr-2"
              onClick={() => info('title', 'message body')
              }>info</button>
            <button
              className="btn btn-light mr-2"
              onClick={clear}
            >clear</button>
          </div>
          <SyntaxHighlighter style={docco}>{`
import { success, error, warning, info } from '@samoyed/toast';

success('title', 'message body')
error('title', 'message body')
warning('title', 'message body')
info('title', 'message body')
clear()
          `}</SyntaxHighlighter>
        </div>
      </Page>
    );
  }
}
