
import * as React from 'react';
import Page from '@samoyed/page';
import TextField from '@samoyed/field-text';
import NumberField from '@samoyed/field-number';
import CheckboxField from '@samoyed/field-checkbox';
import SwitchField from '@samoyed/field-switch';
import SelectField from '@samoyed/field-select';
import DateTimeField from '@samoyed/field-datetime';
import ImageField from '@samoyed/field-image';
import { RouteComponentProps } from '@samoyed/router';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';
import options from './options';

interface State {
  name: string;
  balance: number;
  checked: boolean;
  multi: string[];
  selectMulti: string[];
  time: string;
  pics: Array<string>;
}

export default class BoxPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      name: '',
      balance: 3919675.56,
      checked: false,
      multi: ['primary', 'success'],
      selectMulti: ['primary', 'success'],
      time: (new Date()).toString(),
      pics: []
    };
  }

  render() {
    const { name, balance, checked, pics } = this.state;
    return (
      <Page
        className="field-page"
        scrollable="vertical"
        last={this.props.last}
        active={this.props.active}
      >
        <h1>Field</h1>

        <h2>text</h2>
        <div className="demo">
          <div className="preview">
            <TextField
              label="Name:"
              placeholder="Your name?"
              help="Please input your name"
              value={name}
              onChange={(v) => this.setState({ name: v })}
            />
          </div>
          <SyntaxHighlighter style={docco}>{`
<TextField
  label="Name:"
  placeholder="Your name?"
  help="Please input your name"
  value={name}
  onChange={(v) => this.setState({ name: v })}
/>
          `.trim()}</SyntaxHighlighter>
        </div>

        <h2>number</h2>
        <div className="demo">
          <div className="preview">
            <NumberField
              label="Balance:"
              value={balance}
              help={`Real: ${balance}`}
              min={0}
              format="0,0.0000"
              onChange={(v) => this.setState({ balance: v })}
            />
          </div>
          <SyntaxHighlighter style={docco}>{`
<NumberField
  label="Balance:"
  value={balance}
  min={0}
  format="0,0.0000"
  onChange={(v) => this.setState({ balance: v })}
/>
          `.trim()}</SyntaxHighlighter>
        </div>

        <h2>checkbox</h2>
        <div className="demo">
          <div className="preview">
            <CheckboxField
              label="Checked:"
              help={`${checked ? 'true' : 'false'}`}
              value={checked}
              multi={false}
              onChange={(v) => this.setState({ checked: v })}
            />
          </div>
          <SyntaxHighlighter style={docco}>{`
<CheckboxField
  label="Checked:"
  help={checked ? 'true' : 'false'}
  value={checked}
  multi={false}
  onChange={(v) => this.setState({ checked: v })}
/>
          `.trim()}</SyntaxHighlighter>
        </div>

        <h2>switch</h2>
        <div className="demo">
          <div className="preview">
            <SwitchField
              label="Switch:"
              help="props: multi,options,help,label,value"
              multi
              value={this.state.multi}
              options={options}
              onChange={(v: any) => this.setState({ multi: v })}
            />
          </div>
          <SyntaxHighlighter style={docco}>{`
<SwitchField
  label="Switch:"
  help="props: multi,options,help,label,value"
  multi
  value={this.state.multi}
  options={options}
  onChange={(v: any) => this.setState({ multi: v })}
/>
          `.trim()}</SyntaxHighlighter>
        </div>

        <h2>select</h2>
        <div className="demo">
          <div className="preview">
            <SelectField
              label="Select:"
              help="props: multi,options,help,label,value"
              multi={true}
              value={this.state.selectMulti}
              options={options}
              onChange={(v: any) => this.setState({ selectMulti: v })}
            />
          </div>
          <SyntaxHighlighter style={docco}>{`
<SelectField
  label="Select:"
  help="props: multi,options,help,label,value"
  multi
  value={this.state.selectMulti}
  options={options}
  onChange={(v: any) => this.setState({ selectMulti: v })}
/>
          `.trim()}</SyntaxHighlighter>
        </div>
        <h2>datetime</h2>
        <div className="demo">
          <div className="preview">
            <DateTimeField
              label="Date Time:"
              help="props:value, disabled, help, label, format, dateFormat, timeFormat, locale"
              value={this.state.time}
              format="YYYY/MM/DD"
              onChange={(v: string) => this.setState({ time: v })}
            />
          </div>
          <SyntaxHighlighter style={docco}>{`
<DateTimeField
  label="Date Time:"
  help="props:help,label,value"
  value={this.state.time}
  format="YYYY/MM/DD"
  onChange={(v: string) => this.setState({ time: v })}
/>
          `.trim()}</SyntaxHighlighter>
        </div>

        <h2>image</h2>
        <div className="demo">
          <div className="preview">
            <ImageField
              label="Pic:"
              help="props:value, disabled, help, label, apiUrl, allowed, maxSize"
              apiUrl="/api/image"
              value={pics}
              multi={true}
              onChange={(v: any) => this.setState({ pics: v })}
            />
          </div>
          <SyntaxHighlighter style={docco}>{`
<ImageField
  label="Pic:"
  help="props:value, disabled, help, label, apiUrl, allowed, maxSize"
  apiUrl="/api/image"
  value={pics}
  multi={true}
  onChange={(v: any) => this.setState({ pics: v })}
/>
          `.trim()}</SyntaxHighlighter>
        </div>

      </Page>
    );
  }
}
