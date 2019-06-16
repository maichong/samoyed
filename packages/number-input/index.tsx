import * as React from 'react';
import * as numeral from 'numeral';
import { NumberInputProps } from '.';

interface State {
  display?: string;
  _value?: number;
}

export default class NumberInput extends React.Component<NumberInputProps, State> {
  constructor(props: NumberInputProps) {
    super(props);
    this.state = {
    };
  }

  static getDerivedStateFromProps(nextProps: NumberInputProps, prevState: State) {
    if (nextProps.value !== prevState._value) {
      return {
        _value: nextProps.value,
        display: numeral(nextProps.value).format(nextProps.format)
      };
    }
    return null;
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let display = event.target.value;
    this.setState({ display });
  };

  handleBlur = () => {
    const { min, max, format } = this.props;
    let value = this.state.display;
    let unfomarted = numeral(value).value();
    if (Number.isNaN(unfomarted)) {
      unfomarted = 0;
    }
    if (typeof min === 'number' && min > unfomarted) {
      unfomarted = min;
    }
    if (typeof max === 'number' && max < unfomarted) {
      unfomarted = max;
    }
    if (format) {
      this.setState({ display: numeral(unfomarted).format(format) });
    } else {
      this.setState({ display: String(unfomarted || '') });
    }
    if (unfomarted !== this.props.value) {
      this.props.onChange(unfomarted);
    }
  };

  render() {
    let { className, type = 'text', style, inputRef, placeholder, disabled } = this.props;

    return (<input
      className={className}
      type={type}
      style={style}
      ref={inputRef}
      placeholder={placeholder}
      disabled={disabled}
      value={this.state.display}
      onChange={this.handleChange}
      onBlur={this.handleBlur}
    />);
  }
}
