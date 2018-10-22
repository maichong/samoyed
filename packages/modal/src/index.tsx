import React, { Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import random from 'string-random';
import { PromptOptions } from '..';

type Type = 'alert' | 'confirm' | 'prompt';

interface Item {
  id: string;
  type: Type;
  title: ReactNode;
  body?: ReactNode | typeof Component;
  options?: PromptOptions;
  promptValue?: string;
  onHide: Function;
  callback: Function;
}

const updaters = new Set();
const items: Item[] = [];

function isOptions(options: any): boolean {
  return options && typeof options === 'object' && !React.isValidElement(options);
}

function create(type: Type) {
  return function (title: ReactNode, body?: ReactNode | typeof Component, options?: PromptOptions): Promise<void> {
    if (!options && isOptions(body)) {
      // @ts-ignore
      options = body;
      body = null;
    }
    return new Promise((resolve) => {
      let item = {
        id: random(),
        type,
        title,
        body,
        options,
        onHide: function (res: any) { },
        callback: (res?: any) => {
          items.splice(items.indexOf(item), 1);
          resolve(res);
        }
      };
      items.push(item);
      updaters.forEach((update) => update());
    });
  }
}

export const alert = create('alert');
export const confirm = create('confirm');
export const prompt = create('prompt');

function renderItem(item: Item): ReactNode {
  let options = item.options || {};
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
  return (
    <Modal show animation={false} onHide={null}>
      <Modal.Header
        closeButton={options.closeButton !== false}
        onHide={item.onHide}
      >
        {item.title}
      </Modal.Header>
      {body}
    </Modal>
  );
}

export default class ModalBus extends Component<{}> {
  componentDidMount() {
    updaters.add(this.forceUpdate);
  }

  componentWillUnmount() {
    updaters.delete(this.forceUpdate);
  }

  render() {
    return items.map(renderItem);
  }
}
