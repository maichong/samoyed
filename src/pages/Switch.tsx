
import * as React from 'react';
import Switch from '@samoyed/switch';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';
import options from './options';

type State = {
  value: string;
  clearable: string;
  multi: string[];
};

export default class SwitchPage extends React.Component<{}, State> {
  state = {
    value: 'primary',
    clearable: 'primary',
    multi: ['primary', 'success']
  };

  render() {
    return (
      <div>
        <h1>Switch</h1>

        <h2>select</h2>
        <div className="demo">
          <div className="preview">
            <Switch value={this.state.value} options={options} onChange={(v) => this.setState({ value: v })} />
          </div>
          <SyntaxHighlighter style={docco}>{'<Switch value={value} options={options} />'}</SyntaxHighlighter>
        </div>

        <h2>clearable</h2>
        <div className="demo">
          <div className="preview">
            <Switch clearable value={this.state.clearable} options={options} onChange={(v) => this.setState({ clearable: v })} />
          </div>
          <SyntaxHighlighter style={docco}>{'<Switch clearable value={value} options={options} />'}</SyntaxHighlighter>
        </div>

        <h2>multi</h2>
        <div className="demo">
          <div className="preview">
            <Switch multi value={this.state.multi} options={options} onChange={(v) => this.setState({ multi: v })} />
          </div>
          <SyntaxHighlighter style={docco}>{'<Switch multi value={value} options={options} />'}</SyntaxHighlighter>
        </div>

        <h2>disabled</h2>
        <div className="demo">
          <div className="preview">
            <Switch disabled multi value={this.state.multi} options={options} onChange={(v) => this.setState({ multi: v })} />
          </div>
          <SyntaxHighlighter style={docco}>{'<Switch disabled multi value={value} options={options} />'}</SyntaxHighlighter>
        </div>

      </div>
    );
  }
}
