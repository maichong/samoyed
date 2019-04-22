import * as React from 'react';
import { BoxProps } from '@samoyed/box';

export interface PageProps extends BoxProps {
  previous?: boolean;
  last?: boolean;
}

declare const Page: React.FunctionComponent<PageProps>;

export default Page;
