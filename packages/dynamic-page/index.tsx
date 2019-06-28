import * as React from 'react';
import * as classnames from 'classnames';
import app from '@samoyed/app';
import Page from '@samoyed/page';
import { DynamicPageProps } from '.';

interface State {
}

export const context = React.createContext({});

export default class DynamicPage extends React.Component<DynamicPageProps, State> {
  constructor(props: DynamicPageProps) {
    super(props);
    this.state = {};
  }

  render() {
    return 'DynamicPage';
  }
}

app.components.DynamicPage = DynamicPage;
