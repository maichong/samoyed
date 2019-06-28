import * as React from 'react';
import { PageProps } from '@samoyed/page';

declare module '@samoyed/app' {
  export interface Components {
    DynamicPage?: React.ComponentClass<DynamicPageProps>;
  }
}

export interface DynamicPageProps extends PageProps {
}

export default class DynamicPage extends React.Component<DynamicPageProps> {
}
