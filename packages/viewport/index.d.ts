import * as React from 'react';
import { BoxProps } from '@samoyed/box';

export interface ViewportProps extends BoxProps {
}

declare const Viewport: React.FunctionComponent<ViewportProps>;

export default Viewport;
