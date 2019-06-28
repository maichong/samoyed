import * as React from 'react';
import * as classnames from 'classnames';
import Box from '@samoyed/box';
import Icon from '@samoyed/icon';
import TooltipWrapper from '@samoyed/tooltip-wrapper';
import { Layout, ObjectMap } from '@samoyed/types';
import { ToolbarProps, Tool } from '.';

const PLACEMENT_LAYOUT: ObjectMap<Layout> = {
  top: 'horizontal',
  bottom: 'horizontal',
  left: 'vertical',
  right: 'vertical'
};

export default function Toolbar(props: ToolbarProps) {
  const {
    children, className, bodyClassName, placement = 'top',
    color, icon, title, titleAlign, tools,
    ...others
  } = props;
  let content;
  if (icon || title) {
    content = <div className={classnames(`s-toolbar-title s-flex s-align-${titleAlign || 'left'}`, {
      's-has-icon': icon,
      's-has-text': title,
    })}>
      {icon && <Icon name={icon} />}
      {title && React.isValidElement(title) ? title : <span className="s-text">{title}</span>}
    </div>;
  }

  let leftTools: any[] = [];
  let rightTools: any[] = [];
  tools && tools.forEach((tool: Tool, index: number) => {
    if (React.isValidElement(tool)) {
      rightTools.push(tool);
      return;
    }
    let list = tool.placement === 'left' ? leftTools : rightTools;

    let colorCls = tool.color ? `text-${tool.color}` : '';
    let el = <div
      key={list.length}
      onClick={tool.disabled ? null : tool.onClick}
      className={classnames('s-tool', colorCls, {
        's-has-icon': tool.icon,
        's-has-text': tool.text,
        's-disabled': tool.disabled,
        's-hover': !tool.disabled,
      })}
    >
      {tool.icon && <Icon name={tool.icon} />}
      {tool.text && (React.isValidElement(tool.text) ? tool.text : <span className="s-text">{tool.text}</span>)}
    </div>;
    if (tool.tooltip) {
      el = <TooltipWrapper placement="bottom" tooltip={tool.tooltip}>{el}</TooltipWrapper>;
    }
    list.push(el);
  });

  return (
    <Box
      className={classnames(`s-toolbar s-toolbar-${placement}`, className, {
        [`s-toolbar-${color}`]: color
      })}
      bodyClassName={classnames('s-toolbar-body', bodyClassName)}
      bg={color}
      layout={PLACEMENT_LAYOUT[placement]}
      {...others}
    >
      <div className="s-toolbar-start">{leftTools}</div>
      {content}
      {children}
      <div className="s-toolbar-end">{rightTools}</div>
    </Box>
  );
}
