import * as React from 'react';
import * as _ from 'lodash';
import * as tr from 'grackle';
import * as classnames from 'classnames';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import CreatableSelect from 'react-select/lib/Creatable';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import { SelectValue, SelectOption, ObjectMap } from '@samoyed/types';
import { SelectProps } from '.';

function init(
  value: SelectValue | SelectValue[],
  options: SelectOption[],
  oldLabelMap: ObjectMap<string>
): SelectState {
  let optionsMap: { [value: string]: SelectOption } = {};
  let valueMap: { [key: string]: boolean } = {};
  let labelMap: ObjectMap<string> = {};
  let values: string[] = [];
  if (Array.isArray(value)) {
    _.forEach(value, (v) => {
      valueMap[String(v)] = true;
      values.push(String(v));
      labelMap[String(v)] = oldLabelMap[String(v)];
    });
  } else {
    valueMap[String(value)] = true;
    values.push(String(value));
    labelMap[String(value)] = oldLabelMap[String(value)];
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
  values.forEach((v) => {
    if (optionsMap[v]) {
      labelMap[v] = optionsMap[v].label;
    }
  });
  return { _value: value, options: res, optionsMap, labelMap };
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
    return { value: v, label: selectState.labelMap[v] || v };
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
  labelMap: ObjectMap<string>;
}

export default class Select extends React.Component<SelectProps, SelectState> {
  constructor(props: SelectProps) {
    super(props);
    let data: SelectState = init(props.value, props.options || props.defaultOptions as any[], {});
    this.state = {
      _value: props.value,
      options: data.options,
      optionsMap: data.optionsMap,
      labelMap: data.labelMap,
      value: processValue(props.multi, props.value, data)
    };
  }

  static getDerivedStateFromProps(nextProps: SelectProps, prevState: SelectState) {
    let state: Partial<SelectState> = {
      _value: nextProps.value
    };
    if (nextProps.options !== prevState.options || nextProps.value !== prevState._value) {
      let data = init(nextProps.value, nextProps.options || nextProps.defaultOptions as any[], prevState.labelMap);
      state.options = data.options;
      state.optionsMap = data.optionsMap;
      state.labelMap = data.labelMap;
      state.value = processValue(nextProps.multi, nextProps.value, data);
    }
    return state;
  }

  handleSearch = (keyword: string, callback: Function) => {
    this.props.loadOptions(keyword, (options: SelectOption[]) => {
      if (_.size(this.state.labelMap)) {
        let values: string[] = [];
        options.forEach((opt) => values.push(String(opt.value)));
        let others: SelectOption[] = [];
        _.forEach(this.state.labelMap, (label: string, value: string) => {
          if (values.indexOf(value) < 0) {
            others.push({ label, value });
          }
        });
        if (others.length) {
          options = options.concat(others);
        }
      }
      callback(options);
    });
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
      className,
      onChange,
      value,
      options,
      multi,
      allowCreate,
      disabled,
      placeholder,
      clearable,
      loadOptions,
      ...others
    } = this.props;

    let View;

    let props = {
      className: classnames('select', className),
      classNamePrefix: 'select',
      isMulti: multi,
      isClearable: clearable,
      isDisabled: disabled,
      placeholder: placeholder || tr('Select...'),
      onChange: this.handleChange,
      value: this.state.value,
      options: this.state.options,
      loadOptions: this.handleSearch
    };

    if (allowCreate) {
      View = CreatableSelect;
      if (loadOptions) {
        View = AsyncCreatableSelect;
      }
      // @ts-ignore
      props.isValidNewOption = (inputValue: string, selectValue: any, selectOptions: SelectOption[]) => {
        return inputValue && !selectOptions
          .map(option => option.label)
          .includes(inputValue);
      };
    } else if (loadOptions) {
      View = AsyncSelect;
    } else {
      View = ReactSelect;
    }
    return React.createElement(View, _.assign(others, props));
  }
}
