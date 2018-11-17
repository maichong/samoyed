import * as React from 'react';
import * as _ from 'lodash';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
// import { colors } from 'react-select/lib/theme';
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
  return { options: res, optionsMap };
}

interface SelectState {
  options: SelectOption[];
  optionsMap: {
    [value: string]: SelectOption;
  };
  value?: SelectOption | SelectOption[];
}

export default class SelectFileld extends React.Component<SelectProps, SelectState> {
  _cache: { [key: string]: SelectOption[] };

  constructor(props: SelectProps) {
    super(props);
    let optionsMap = {};
    let data: SelectState = init(props.value, props.options);
    this.state = {
      options: data.options,
      optionsMap: data.optionsMap,
      value: this.processValue(props.value, data)
    };
    this._cache = {};
  }

  componentWillMount() {
    let props = this.props;
    if (props.loadOptions && (!props.options || !props.options.length)) {
      this.handleSearchChange('');
    }
  }

  componentWillReceiveProps(nextProps: SelectProps) {
    let state = {} as SelectState;
    if (nextProps.options !== this.props.options || nextProps.value !== this.props.value) {
      let options = nextProps.options;
      //如果有loadOptions,使用组件内部options
      if (nextProps.loadOptions) {
        options = this.state.options;
      }
      let data = init(nextProps.value, options);
      state.options = data.options;
      state.optionsMap = data.optionsMap;
      state.value = this.processValue(nextProps.value, data);
    }
    this.setState(state);
  }

  componentWillUnmount() {
    this._cache = {};
  }

  processValue = (value: SelectValue[] | SelectValue, selectState: SelectState): SelectOption | SelectOption[] => {

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

    if (this.props.multi) {
      // @ts-ignore multi为true，一定为数组
      if (!value || !value.length) {
        return [];
      }
      // @ts-ignore multi为true，一定为数组
      return _.map(value, processOne);
    }
    return processOne(value);
  };

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

  handleSearchChange = (search: string) => {
    const { value } = this.props;
    let { optionsMap } = this.state;
    let cacheKey: string = 'c_' + (search || JSON.stringify(value));
    if (this._cache[cacheKey]) {
      let data: SelectState = init(value, this._cache[cacheKey]);
      this.setState({
        options: data.options,
        optionsMap: data.optionsMap
      });
      return;
    }
    this.props.loadOptions(search, (error, res) => {
      if (!error && res.options) {
        this._cache[cacheKey] = res.options;
        let data: SelectState = init(value, this._cache[cacheKey]);
        this.setState({
          options: data.options,
          optionsMap: data.optionsMap,
          value: this.processValue(value, data)
        });
      }
    });
  };

  render() {
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
    let isOptions = _.pick(this.props, ['clearable', 'searchable']);
    isOptions = _.mapKeys(isOptions, (v, k) => {
      if (k === 'clearable') return 'isClearable';
      if (k === 'searchable') return 'isSearchable';
      return k;
    });
    if (allowCreate) {
      return (
        <CreatableSelect
          className={className || ''}
          classNamePrefix="Select"
          isMulti={!!multi}
          isClearable
          isDisabled={!!disabled}
          onChange={this.handleChange}
          value={this.state.value}
          onInputChange={loadOptions ? this.handleSearchChange : null}
          options={this.state.options}
          placeholder={placeholder ? placeholder : 'Select...'}
          isValidNewOption={(inputValue, selectValue, selectOptions) => {
            const isNotDuplicated = !selectOptions
              .map(option => option.label)
              .includes(inputValue);
            const isNotEmpty = inputValue !== '';
            return isNotEmpty && isNotDuplicated;
          }}
          {...others}
          {...isOptions}
        />
      );
    }
    return (
      <Select
        isMulti={!!multi}
        isDisabled={!!disabled}
        className={className || ''}
        classNamePrefix="Select"
        onChange={this.handleChange}
        options={this.state.options}
        placeholder={placeholder ? placeholder : 'Select...'}
        value={this.state.value}
        onInputChange={loadOptions ? this.handleSearchChange : null}
        {...others}
        {...isOptions}
      />
    );
  }
}
