import * as React from 'react';
import * as EventEmitter from 'events';
import { Components } from '@samoyed/app';
import { PageProps } from '@samoyed/page';
import { RouteComponentProps } from '@samoyed/router';
import { Page, LayoutsState, DetailsState, ListsState } from '@samoyed/redux';

declare module '@samoyed/app' {
  export interface Components {
    DynamicPage?: React.ComponentClass<DynamicPageProps>;
  }
}

export interface PageContextValue {
  scrollEvents: EventEmitter;
}

declare const context: React.Context<PageContextValue>;

export { context };

export interface DynamicPageProps extends PageProps, RouteComponentProps<{ id: string }> {
  pageRecord: Page;
  components?: Components;
}

export interface OriginalDynamicPageProps extends DynamicPageProps {
  layouts: LayoutsState;
  details: DetailsState;
  lists: ListsState;
}

export class OriginalDynamicPage extends React.Component<OriginalDynamicPageProps> {
}

export default class DynamicPage extends React.Component<DynamicPageProps> {
}
