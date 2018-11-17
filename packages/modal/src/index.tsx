import * as React from 'react';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import * as random from 'string-random';
import { PromptOptions, ButtonOptions } from '..';
import * as tr from 'grackle';

type Type = 'alert' | 'confirm' | 'prompt';

interface Item {
  id: string;
  type: Type;
  title: React.ReactNode;
  body?: React.ReactNode | typeof React.Component;
  options?: PromptOptions;
  buttons: React.ReactNode[];
  promptValue?: string;
  cancel: () => void;
}

const updaters = new Set();
const items: Item[] = [];

function isOptions(options: any): boolean {
  return options && typeof options === 'object' && !React.isValidElement(options);
}

function create(type: Type) {
  return function (title: React.ReactNode, body?: React.ReactNode | typeof React.Component, options?: PromptOptions): Promise<any> {
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
      let buttons: React.ReactNode[] = btns.map((btn, index) => (<button
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
          if (res && typeof res.then === 'function') {
            res.then((r: boolean | void) => {
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
  };
}

export const alert = create('alert');
export const confirm = create('confirm');
export const prompt = create('prompt');

function renderItem(item: Item): React.ReactNode {
  let { title, options } = item;
  let itemBody = item.body;
  let body = null;
  if (itemBody && itemBody instanceof React.Component) {
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
    body = <ModalBody>{itemBody}</ModalBody>;
  }

  return (
    <Modal key={item.id} isOpen toggle={item.cancel}>
      <ModalHeader toggle={options.closeButton === false ? null : item.cancel}>
        {title}
      </ModalHeader>
      {body}
      {item.buttons.length && <div className="modal-footer">
        {item.buttons}
      </div>}
    </Modal>
  );
}

export default class ModalBus extends React.Component<{}> {
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
