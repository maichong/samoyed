
import * as React from 'react';
import CheckboxGroup from '../../packages/checkbox-group/src/index';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';
import options from './options';

type State = {
  value: string;
  clearable: string;
  multi: string[];
};

export default class CheckboxGroupPage extends React.Component<{}, State> {
  state = {
    value: 'primary',
    clearable: 'primary',
    multi: ['primary', 'success']
  };

  render() {
    return (
      <div>
        <h1>Checkbox Group</h1>

        <h2>radio group</h2>
        <div className="demo">
          <div className="preview">
            <CheckboxGroup value={this.state.value} options={options} onChange={(v) => this.setState({ value: v })} />
          </div>
          <SyntaxHighlighter style={docco}>{'<CheckboxGroup value={value} options={options} />'}</SyntaxHighlighter>
        </div>

        <h2>clearable</h2>
        <div className="demo">
          <div className="preview">
            <CheckboxGroup clearable value={this.state.clearable} options={options} onChange={(v) => this.setState({ clearable: v })} />
          </div>
          <SyntaxHighlighter style={docco}>{'<CheckboxGroup clearable value={value} options={options} />'}</SyntaxHighlighter>
        </div>

        <h2>multi</h2>
        <div className="demo">
          <div className="preview">
            <CheckboxGroup multi value={this.state.multi} options={options} onChange={(v) => this.setState({ multi: v })} />
          </div>
          <SyntaxHighlighter style={docco}>{'<CheckboxGroup multi value={value} options={options} />'}</SyntaxHighlighter>
        </div>

        <h2>disabled</h2>
        <div className="demo">
          <div className="preview">
            <CheckboxGroup disabled multi value={this.state.multi} options={options} onChange={(v) => this.setState({ multi: v })} />
          </div>
          <SyntaxHighlighter style={docco}>{'<CheckboxGroup disabled multi value={value} options={options} />'}</SyntaxHighlighter>
        </div>
      </div>
    );
  }
}
