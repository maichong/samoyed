import React, { Component, ReactNode } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import random from 'string-random';
import { PromptOptions, ButtonOptions } from '..';
import tr from 'grackle';
import isPromise from 'is-promise';

type Type = 'alert' | 'confirm' | 'prompt';

interface Item {
  id: string;
  type: Type;
  title: ReactNode;
  body?: ReactNode | typeof Component;
  options?: PromptOptions;
  buttons: ReactNode[];
  promptValue?: string;
  cancel: Function;
}

const updaters = new Set();
const items: Item[] = [];

function isOptions(options: any): boolean {
  return options && typeof options === 'object' && !React.isValidElement(options);
}

function create(type: Type) {
  return function (title: ReactNode, body?: ReactNode | typeof Component, options?: PromptOptions): Promise<any> {
    if (!options && isOptions(body)) {
      // @ts-ignore
      options = body;
      body = null;
    }
    options = options || {};
    let btns: ButtonOptions[] = options.buttons;
    if (!btns) {
      btns = [{ text: tr([type + '_button_OK', 'button_OK', 'OK']), style: 'primary' }];
      if (type !== 'alert') {
        btns.unshift({ text: tr([type + '_button_cancel', 'button_cancel', 'Cancel']) });
      }
    }

    return new Promise((resolve) => {
      let buttons: ReactNode[] = btns.map((btn, index) => (<button
        key={index}
        className={'btn btn-' + (btn.style || 'light')}
        onClick={() => handle(index)}
      >{btn.text}</button>));

      let item: Item = {
        id: random(),
        type,
        title,
        body,
        buttons,
        options,
        cancel: function () {
          handle(0);
        }
      };
      items.push(item);

      function close(btn: number) {
        items.splice(items.indexOf(item), 1);
        updaters.forEach((update) => update());

        if (type === 'prompt') {
          resolve(btn === 0 ? '' : item.promptValue);
        } else {
          resolve(btn);
        }
      }

      function handle(btn: number) {
        if (options.handle) {
          let res = options.handle(btn);
          if (res === false) return;
          if (isPromise(res)) {
            res.then((r) => {
              if (r === false) return;
              close(btn);
            });
            return;
          }
        }
        close(btn);
      }

      updaters.forEach((update) => update());
    });
  }
}

export const alert = create('alert');
export const confirm = create('confirm');
export const prompt = create('prompt');

function renderItem(item: Item): ReactNode {
  let { title, options } = item;
  let itemBody = item.body;
  let body = null;
  if (itemBody && itemBody instanceof Component) {
    // @ts-ignore
    itemBody = React.createElement(itemBody, {});
  }
  if (item.type === 'prompt') {
    itemBody = (
      <div>
        {itemBody}
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder={options.placeholder}
            value={item.promptValue}
            onChange={(e) => {
              item.promptValue = e.target.value;
              updaters.forEach((update) => update());
            }}
          />
        </div>
      </div>
    );
  }
  if (itemBody) {
    body = <Modal.Body>{itemBody}</Modal.Body>;
  }

  if (typeof title === 'string') {
    title = <h5 className='modal-title'>{title}</h5>;
  }

  return (
    <Modal key={item.id} show animation={false} onHide={undefined}>
      <Modal.Header>
        {title}
        {options.closeButton !== false && <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          // @ts-ignore
          onClick={item.cancel}
        >
          <span aria-hidden="true">&times;</span>
        </button>}
      </Modal.Header>
      {body}
      {item.buttons.length && <div className="modal-footer">
        {item.buttons}
      </div>}
    </Modal>
  );
}

export default class ModalBus extends Component<{}> {
  componentDidMount() {
    updaters.add(this.update);
  }

  componentWillUnmount() {
    updaters.delete(this.update);
  }

  update = () => {
    this.forceUpdate();
  };

  render() {
    return items.map(renderItem);
  }
}
