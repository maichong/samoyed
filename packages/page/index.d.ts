import * as React from 'react';
import { BoxProps } from '@samoyed/box';

export interface PageProps extends BoxProps {
  previous?: boolean;
  last?: boolean;
}

export default class Page extends React.Component<PageProps> {
}
