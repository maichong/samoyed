import * as React from 'react';
import * as _ from 'lodash';
import * as classnames from 'classnames';
import * as shallowEqualWithout from 'shallow-equal-without';
import akita, { Client } from 'akita';
import { ImageFieldProps } from '.';

let client: Client = akita.create({});

interface ImageFieldState {
  error: string;
}

export default class ImageField extends React.Component<ImageFieldProps, ImageFieldState> {
  static defaultProps = {
    apiUrl: '/api/image'
  };

  imageInput: any;
  uploadQueue: File[];
  currentTask: File;

  constructor(props: ImageFieldProps) {
    super(props);
    this.state = {
      error: '',
    };
    this.uploadQueue = [];
  }

  shouldComponentUpdate(props: ImageFieldProps, state: ImageFieldState): boolean {
    return !shallowEqualWithout(props, this.props, 'record') || state.error !== this.state.error;
  }

  async upload() {
    const { apiUrl, multi, mode } = this.props;
    let file = this.uploadQueue.shift();
    if (!file) return;
    this.currentTask = file;
    try {
      let image = await client.post(apiUrl, {
        body: {
          file
        }
      });
      let item = mode === 'link' ? image.url : image;
      let { value, onChange } = this.props;
      if (multi) {
        value = (value || []).concat(item);
        onChange(value);
      } else {
        onChange(item);
      }
    } catch (e) {
      this.setState({ error: e.message });
    }
    this.currentTask = null;
    if (this.uploadQueue.length) {
      this.upload();
    }
  }

  handleAddImage = () => {
    let { multi, value, allowed, maxSize, max } = this.props;
    let newValue: any = value;
    if (value) {
      if (!multi) {
        newValue = [value];
      } else {
        newValue = value.concat();
      }
    }

    let nextState = {
      error: ''
    };

    max = multi ? (max || 1000) : 1;

    _.forEach(this.imageInput.files, (file: File) => {
      if (newValue.length >= max || !file) return;
      let matchs = file.name.match(/\.(\w+)$/);
      if (!matchs) {
        nextState.error = 'Invalid image format';
        return;
      }
      let ext = matchs[1].replace('jpeg', 'jpg').toLowerCase();
      if ((allowed || ['png', 'jpg', 'svg', 'webp']).indexOf(ext) < 0) {
        nextState.error = 'Invalid image format';
        return;
      }

      if (file.size && file.size > maxSize) {
        nextState.error = 'Image exceeds the allowed size';
        return;
      }

      this.uploadQueue.push(file);
    });
    this.setState(nextState);
    if (this.uploadQueue.length && !this.currentTask) this.upload();
  };

  handleRemoveItem(index: number) {
    let value: any = null;
    if (this.props.multi) {
      value = [];
      _.map(this.props.value, (url: any, i: number) => {
        if (i !== index) {
          value.push(url);
        }
      });
    }
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    let {
      className, value, multi, help, label, disabled, error, max
    } = this.props;
    max = multi ? (max || 1000) : 1;
    let newValue: any = value;
    if (!multi) {
      newValue = value ? [value] : [];
    }
    let items: React.ReactNode[] = [];
    let readonly = disabled;
    _.forEach(newValue, (url: any, index: number) => {
      if (url && typeof url === 'object') {
        url = url.thumbUrl || url.url;
      }
      items.push((
        <div key={index} className="image-field-item">
          <img alt="" src={url} />
          {
            readonly ? null : (
              <div
                className="image-field-del"
                onClick={() => this.handleRemoveItem(index)}
              >X</div>
            )
          }
        </div>
      ));
    });
    if (items.length < max) {
      // 还未超出
      if (!readonly) {
        items.push((
          <div className="image-field-item image-field-add" key="add">
            <i className="fa fa-plus-square-o" />
            <input
              ref={(r) => {
                this.imageInput = r;
              }}
              multiple={multi || false}
              accept="image/png;image/jpg;"
              type="file"
              onChange={this.handleAddImage}
            />
          </div>
        ));
      }
    }

    if (!items.length && readonly) {
      items.push((
        <div className="image-field-item image-field-add" key="add">
          <i className="fa fa-picture-o" />
        </div>
      ));
    }

    error = error || this.state.error as string;
    return (
      <div className={classnames('s-component s-field s-field-image form-group', className, { 'is-invalid': error })}>
        {label && <label>{label}</label>}
        <div>{items}</div>
        {error && <small className="form-text invalid-feedback">{error}</small>}
        {help && <small className={classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error })}>{help}</small>}
      </div>
    );
  }
}
