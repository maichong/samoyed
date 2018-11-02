import React, { Component, ReactNode } from 'react';
import _ from 'lodash';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
// import { colors } from 'react-select/lib/theme';
import { SelectValue, SelectOption } from '@samoyed/types';
import { SelectProps } from '..';

function processOptions(
  optionsMap: {
    [value: string]: SelectOption,
  },
  value: SelectValue | SelectValue[],
  options?: SelectOption[]
): SelectOption[] {
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
    // opt.value = String(opt.value);
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
  return res;
}

interface SelectState {
  options: SelectOption[],
  optionsMap: {
    [value: string]: SelectOption,
  },
  value?: SelectOption | SelectOption[]
}

export default class SelectFileld extends Component<SelectProps, SelectState> {
  _cache: { [key: string]: SelectOption[] };

  constructor(props: SelectProps) {
    super(props);
    let optionsMap = {};
    let options = processOptions(optionsMap, props.value, props.options);
    this.state = {
      options,
      optionsMap,
      value: this.processValue(props.value, { options, optionsMap })
    };
    this._cache = {};
  }

  componentWillMount() {
    let props = this.props;
    if (props.loadOptions && (!props.options || !props.options.length)) {
      this.handleSearchChange('');
    }
  }

  componentWillReceiveProps(props: SelectProps) {
    let state = {} as SelectState;
    if (props.options !== this.props.options || props.value !== this.props.value) {
      state.optionsMap = this.state.optionsMap;
      let options = props.options;
      if (props.multi && props.loadOptions) {
        options = this.state.options;
      }
      state.options = processOptions(state.optionsMap, props.value, options);
      state.value = this.processValue(props.value);
    }
    this.setState(state);
  }

  componentWillUnmount() {
    this._cache = {};
  }

  processValue = (value: any, selectState?: SelectState): SelectOption | SelectOption[] => {
    let state: SelectState = this.state || selectState || {} as SelectState
    let optionsMap = state.optionsMap || {};


    function processOne(v: any): SelectOption {
      if (v && typeof v === 'object') {
        if (v.value !== undefined) {
          return v;
        }
        return v;
      }
      if (optionsMap[String(v)]) {
        return optionsMap[String(v)];
      }
      return { value: v };
    }

    if (this.props.multi) {
      if (!value || !value.length) {
        return [];
      }
      return _.map(value, processOne);
    }
    return processOne(value);
  };

  handleChange = (value: SelectOption | SelectOption[]) => {
    let { optionsMap } = this.state;
    let newValue: SelectValue | SelectValue[] = '';
    if (value) {
      if (Array.isArray(value)) {
        let arr: SelectValue[] = [];
        value.forEach((vv: SelectOption) => {
          if (vv.label != String(vv.value)) {
            optionsMap[String(vv.value)] = vv;
          }
          arr.push(vv.value);
        });
        newValue = arr;
      } else {
        optionsMap[String(value.value)] = value;
        newValue = value.value;
      }
    }
    // @ts-ignore
    this.setState({
      optionsMap,
      value: newValue
    });
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  };

  handleSearchChange = (search: string) => {
    const { value } = this.props;
    let { optionsMap } = this.state;
    let cacheKey: string = 'c_' + (search || JSON.stringify(value));
    if (this._cache[cacheKey]) {
      this.setState({
        options: processOptions(optionsMap, value, this._cache[cacheKey]),
        optionsMap
      });
      return;
    }
    this.props.loadOptions(search, (error, res) => {
      if (!error && res.options) {
        this._cache[cacheKey] = res.options;
        this.setState({
          options: processOptions(optionsMap, value, this._cache[cacheKey]),
          optionsMap
        });
      }
    });
  };

  render() {
    const { t } = this.context;
    let {
      onChange,
      value,
      options,
      multi,
      allowCreate,
      loadOptions,
      disabled,
      placeholder,
      clearable,
      searchable,
      className,
      ...others
    } = this.props;
    if (allowCreate) {
      return (
        <CreatableSelect
          autoFocus
          isMulti={!!multi}
          isSearchable={!!searchable}
          isDisabled={!!disabled}
          className={className || ''}
          onChange={this.handleChange}
          value={this.state.value}
          onInputChange={loadOptions ? this.handleSearchChange : undefined}
          options={this.state.options}
          placeholder="Search..."
          {...others}
        />
      );     
    }
    return (
      <Select
        autoFocus
        isMulti={!!multi}
        isClearable={!!clearable}
        isSearchable={!!searchable}
        isDisabled={!!disabled}
        className={className || ''}
        onChange={this.handleChange}
        options={this.state.options}
        placeholder={placeholder ? placeholder : 'Select...'}
        value={this.state.value}
        onInputChange={loadOptions ? this.handleSearchChange : undefined}
        {...others}
      />
    );
  }
}
