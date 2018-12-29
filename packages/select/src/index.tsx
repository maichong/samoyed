import * as React from 'react';
import * as _ from 'lodash';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import { SelectValue, SelectOption } from '@samoyed/types';
import { SelectProps } from '..';

function init(
  value: SelectValue | SelectValue[],
  options?: SelectOption[]
): SelectState {
  let optionsMap: { [value: string]: SelectOption } = {};
  let valueMap: { [key: string]: boolean } = {};
  if (Array.isArray(value)) {
    _.forEach(value, (v) => {
      valueMap[String(v)] = true;
    });
  } else {
    valueMap[String(value)] = true;
  }
  let res = _.map(options || [], (opt: SelectOption) => {
    if (typeof opt.color === 'string') {
      opt = _.omit(opt, 'color');
    }
    let vKey = String(opt.value);
    optionsMap[vKey] = opt;
    if (valueMap[vKey]) {
      delete valueMap[vKey];
    }
    return opt;
  });
  if (_.size(valueMap)) {
    _.keys(valueMap).forEach((v) => {
      if (optionsMap[v]) {
        res.push(optionsMap[v]);
      }
    });
  }
  return { _value: value, options: res, optionsMap };
}

function processValue(multi: boolean, value: SelectValue[] | SelectValue, selectState: SelectState): SelectOption | SelectOption[] {
  let optionsMap = selectState.optionsMap || {};
  let options = selectState.options || {};

  function processOne(v: SelectValue | any): SelectOption {
    if (optionsMap[String(v)]) {
      return optionsMap[String(v)];
    }
    let item = _.find(options, (opt: SelectOption) => opt.value === v);
    if (item) {
      return item;
    }
    return { value: v, label: v };
  }

  if (multi) {
    // @ts-ignore multi为true，一定为数组
    if (!value || !value.length) {
      return [];
    }
    // @ts-ignore multi为true，一定为数组
    return _.map(value, processOne);
  }
  return processOne(value);
}

interface SelectState {
  _value: SelectValue | SelectValue[];
  value?: SelectOption | SelectOption[];
  options: SelectOption[];
  optionsMap: {
    [value: string]: SelectOption;
  };
}

export default class Select extends React.Component<SelectProps, SelectState> {
  constructor(props: SelectProps) {
    super(props);
    let data: SelectState = init(props.value, props.options);
    this.state = {
      _value: props.value,
      options: data.options,
      optionsMap: data.optionsMap,
      value: processValue(props.multi, props.value, data)
    };
  }

  static getDerivedStateFromProps(nextProps: SelectProps, prevState: SelectState) {
    let state: Partial<SelectState> = {
      _value: nextProps.value
    };
    if (nextProps.options !== prevState.options || nextProps.value !== prevState._value) {
      let data = init(nextProps.value, nextProps.options);
      state.options = data.options;
      state.optionsMap = data.optionsMap;
      state.value = processValue(nextProps.multi, nextProps.value, data);
    }
    return state;
  }

  handleChange = (vOpt: SelectOption | SelectOption[]) => {
    let { optionsMap } = this.state;
    let newValue: SelectValue | SelectValue[] = '';
    let newVopt: SelectOption | SelectOption[] = null;
    if (vOpt) {
      if (Array.isArray(vOpt)) {
        let arr: SelectValue[] = [];
        let arrVopt: SelectOption[] = [];
        vOpt.forEach((opt: SelectOption) => {
          if (opt.label !== String(opt.value)) {
            optionsMap[String(opt.value)] = opt;
          }
          arr.push(opt.value);
          arrVopt.push(opt);
        });
        newValue = arr;
        newVopt = arrVopt;
      } else {
        optionsMap[String(vOpt.value)] = vOpt;
        newValue = vOpt.value;
        newVopt = vOpt;
      }
    }
    if (this.props.onChange) {
      this.props.onChange(newValue);
      return;
    }
    this.setState({
      optionsMap,
      value: newVopt
    });
  };

  render() {
    let {
      onChange,
      value,
      options,
      multi,
      allowCreate,
      disabled,
      placeholder,
      clearable,
      ...others
    } = this.props;
    if (allowCreate) {
      return (
        <CreatableSelect
          classNamePrefix="Select"
          isMulti={multi}
          isClearable={clearable}
          isDisabled={disabled}
          onChange={this.handleChange}
          // @ts-ignore
          value={this.state.value}
          // @ts-ignore
          options={this.state.options}
          placeholder={placeholder ? placeholder : 'Select...'}
          isValidNewOption={(inputValue: string, selectValue: any, selectOptions: SelectOption[]) => {
            return inputValue && !selectOptions
              .map(option => option.label)
              .includes(inputValue);
          }}
          {...others}
        />
      );
    }
    return (
      <ReactSelect
        isMulti={multi}
        isClearable={clearable}
        isDisabled={disabled}
        classNamePrefix="Select"
        placeholder={placeholder ? placeholder : 'Select...'}
        onChange={this.handleChange}
        // @ts-ignore
        options={this.state.options}
        // @ts-ignore
        value={this.state.value}
        {...others}
      />
    );
  }
}
