import * as React from 'react';
import * as classnames from 'classnames';
import Box from '@samoyed/box';
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
      {icon && <i className={`s-icon fa fa-${icon}`} />}
      {title && React.isValidElement(title) ? title : <span className="s-text">{title}</span>}
    </div>;
  }
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
      {content}
      {children}
      {tools && tools.length && tools.map((tool: Tool, index: number) => {
        if (React.isValidElement(tool)) return tool;
        let colorCls = tool.color ? `text-${tool.color}` : '';
        let el = <div
          key={index}
          onClick={tool.disabled ? null : tool.onClick}
          className={classnames('s-tool', colorCls, {
            's-has-icon': tool.icon,
            's-has-text': tool.text,
            's-disabled': tool.disabled,
            's-hover': !tool.disabled,
          })}
        >
          {tool.icon && <i className={`s-icon fa fa-${tool.icon}`} />}
          {tool.text && (React.isValidElement(tool.text) ? tool.text : <span className="s-text">{tool.text}</span>)}
        </div>;
        if (tool.tooltip) {
          el = <TooltipWrapper placement="bottom" tooltip={tool.tooltip}>{el}</TooltipWrapper>;
        }
        return el;
      })}
    </Box>
  );
}
