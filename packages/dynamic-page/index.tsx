import * as React from 'react';
import * as _ from 'lodash';
import * as qs from 'qs';
import * as EventEmitter from 'events';
import * as H from 'history';
import * as shallowEqualWithout from 'shallow-equal-without';
import { connect } from 'react-redux';
import app from '@samoyed/app';
import Box from '@samoyed/box';
import Page from '@samoyed/page';
import { StoreState, Record, RecordList, Layout } from '@samoyed/redux';
import selectList from '@samoyed/utils/select-list';
import { OriginalDynamicPageProps, PageContextValue } from '.';

interface State {
  layoutRecord?: Layout;
  detail?: Record | null;
  id?: string;
  list?: RecordList;
  search?: string;
  filters?: any;
  limit?: number;
  sort?: string;
  query?: any;
  contextValue?: PageContextValue;
  location?: H.Location;
  active?: boolean;
  last?: boolean;
}

export const context = React.createContext({});

export class OriginalDynamicPage extends React.Component<OriginalDynamicPageProps, State> {
  scrollEvents: EventEmitter;

  constructor(props: OriginalDynamicPageProps) {
    super(props);
    this.scrollEvents = new EventEmitter();
    this.state = {
      detail: null,
      id: undefined,
      list: null,
      search: '',
      filters: null,
      limit: 0,
      sort: '',
      query: null,
      location: null,
      contextValue: {
        scrollEvents: this.scrollEvents,
        pageTitle: '',
        setPageTitle: (title: string) => {
          let c = this.state.contextValue;
          if (title === c.pageTitle) return;
          this.setState({
            contextValue: Object.assign({}, c, { pageTitle: title })
          });
          document.title = title;
        }
      }
    };
  }

  static getDerivedStateFromProps(nextProps: OriginalDynamicPageProps, preState: State): State {
    const { pageRecord, details, lists, layouts, match, location } = nextProps;
    let nextState: State = {
      id: match.params.id,
      active: nextProps.active,
      last: nextProps.last,
    };

    let query = preState.query;
    let locationChanged = preState.location !== location;

    if (locationChanged) {
      nextState.location = location;
      query = qs.parse(location.search.substr(1));
      if (!preState.query || !_.isEqual(query, preState.query)) {
        nextState.query = query;
      }
    }

    if (pageRecord.type === 'detail') {
      let records = details[pageRecord.source];
      nextState = records ? (records[match.params.id] || null) : null;
    }

    if (pageRecord.type === 'list') {
      if (nextState.query) {
        nextState.sort = query._sort || '';
        nextState.search = query._search || '';
        nextState.limit = parseInt(query._limit) || app.defaults.listLimit;
        let filters: any = {};
        for (let k in query) {
          if (k[0] === '_') continue;
          filters[k] = query[k];
        }
        if (!Object.keys(filters).length) {
          filters = null;
        }
        if (_.isEqual(filters, preState.filters)) {
          nextState.filters = preState.filters;
        } else {
          nextState.filters = filters;
        }
      }
      nextState.list = selectList(lists[pageRecord.source], nextState.query ? nextState : preState);
    }

    let detail = nextState.detail;
    if (detail && detail.layout) {
      // @ts-ignore
      nextState.layoutRecord = layouts.map[detail.layout];
    }
    if (!nextState.layoutRecord && pageRecord.layout) {
      nextState.layoutRecord = layouts.map[pageRecord.layout];
    }

    if (detail && detail !== preState.detail && preState.contextValue.pageTitle) {
      nextState.contextValue = Object.assign({}, preState.contextValue, { pageTitle: '' });
    }

    return nextState;
  }

  shouldComponentUpdate(props: OriginalDynamicPageProps, state: State) {
    return !shallowEqualWithout(state, this.state);
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    this.init();
  }

  componentWillUnmount() {
    this.scrollEvents.removeAllListeners();
    this.scrollEvents = null;
  }

  init() {
    let { pageRecord } = this.props;
    let { id, detail, list, search, filters, sort, limit } = this.state;
    if (pageRecord.type === 'detail' && id && detail === null) {
      app.actions.loadDetail({ model: pageRecord.source, id });
    } else if (pageRecord.type === 'list' && !list) {
      app.actions.loadList({ model: pageRecord.source, search, filters, sort, limit });
    }
  }

  handleRefresh = (cb: () => any) => {
    let { pageRecord } = this.props;
    let { id, search, filters, sort, limit } = this.state;
    if (pageRecord.type === 'detail') {
      app.actions.loadDetail({ model: pageRecord.source, id, callback: cb });
    } else if (pageRecord.type === 'list') {
      app.actions.loadList({ model: pageRecord.source, search, filters, sort, limit, callback: cb });
    }
  };

  handleLoadMore = () => {
    let { list } = this.state;
    if (list.next) {
      app.actions.loadMore({ model: list.model, list });
    }
  };

  renderLoading() {
    let components = this.props.components || app.components;
    let LoadingPage = components.LoadingPage;
    if (LoadingPage) return <LoadingPage />;
    return 'Loading';
  }

  render() {
    const { pageRecord, router, active } = this.props;
    const { layoutRecord, detail, list, id, query, contextValue } = this.state;
    if (pageRecord.type === 'detail' && !id) return '路由中不存在id参数';
    if (pageRecord.type === 'detail' && !detail) return this.renderLoading();
    if (pageRecord.type === 'list' && !list) return this.renderLoading();

    if (!layoutRecord) return 'Missing layout!';
    if (active) {
      let pageTitle = contextValue.pageTitle;
      if (detail) {
        pageTitle = detail.title;
      }
      if (!pageTitle) {
        pageTitle = pageRecord.title;
      }
      // console.log('active', active);
      // console.log('pageTitle', pageTitle);
      if (document.title !== pageTitle) {
        document.title = pageTitle;
      }
    }

    const components = this.props.components || app.components;
    const refs = Object.assign({}, this.props, this.state);
    const onPullRefresh = (pageRecord.type === 'list' || pageRecord.type === 'detail') ? this.handleRefresh : undefined;
    const onReachBottom = (pageRecord.type === 'list') ? this.handleLoadMore : undefined;
    const pullRefreshTexts = components.PullRefresh;
    const others = _.omit(
      this.props,
      'dispatch',
      'details',
      'lists',
      'layouts',
      'pageRecord',
      'components',
      'history',
      'location',
      'match',
      'staticContext',
      'router',
    );

    let dockTop: React.ReactNode[] = [];
    let dockBottom: React.ReactNode[] = [];
    let center: React.ReactNode[] = [];

    layoutRecord.items.forEach((item) => {
      // @ts-ignore
      let Component = components[item.component];
      if (!Component) {
        console.error(`Missing component: ${item.component}`);
        return;
      }

      let itemProps: any = {
        key: item.id
      };

      _.forEach(item.props, (p, k) => {
        let value = p.value;
        if (p.type === 'ref') {
          value = _.get(refs, p.ref);
        }
        itemProps[k] = value;
      });

      let style: any = {};
      let backgroundImage;
      _.forEach(item.style, (p, k) => {
        let value = p.value;
        if (p.type === 'ref') {
          value = _.get(refs, p.ref);
        }
        if (k === 'backgroundImage') {
          backgroundImage = `url(${value})`;
        } else {
          style[k] = value;
        }
      });
      if (backgroundImage) {
        style.backgroundImage = backgroundImage;
      }
      if (_.size(style)) {
        itemProps.style = style;
      }

      let el = React.createElement(Component, itemProps);

      if (item.position === 'dock-top') {
        dockTop.push(el);
      } else if (item.position === 'dock-bottom') {
        dockBottom.push(el);
      } else {
        center.push(el);
      }
    });

    if (onReachBottom) {
      // @ts-ignore
      let LoadMore = components.LoadMore;
      if (LoadMore) {
        center.push(<LoadMore key="load-more" list={list} />);
      }
    }

    let bodyStyle: any = {};
    let backgroundImage;
    _.forEach(layoutRecord.style, (p, k) => {
      let value = p.value;
      if (p.type === 'ref') {
        value = _.get(refs, p.ref);
      }
      if (k === 'backgroundImage') {
        backgroundImage = `url(${value})`;
      } else {
        bodyStyle[k] = value;
      }
    });
    if (backgroundImage) {
      bodyStyle.backgroundImage = backgroundImage;
    }
    if (!_.size(bodyStyle)) {
      bodyStyle = null;
    }

    // @ts-ignore
    let NavBar = components[layoutRecord.navBar];
    if (NavBar && !query._noNavBar) {
      dockTop.unshift(<NavBar
        key="navbar"
        title={contextValue.pageTitle}
        list={list}
        detail={detail}
        layoutRecord={layoutRecord}
        pageRecord={pageRecord}
        router={router}
      />);
    }

    return (
      <context.Provider value={contextValue}>
        <Page layout="vertical" {...others}>
          {dockTop}
          <Box
            flex
            className="page-content"
            layout="vertical"
            scrollable="vertical"
            onPullRefresh={onPullRefresh}
            pullRefreshTexts={pullRefreshTexts}
            onReachBottom={onReachBottom}
            reachBottomBorder={50}
            bodyStyle={bodyStyle}
            onBodyScroll={(data) => this.scrollEvents.emit('scroll', data)}
          >
            {center}
          </Box>
          {dockBottom}
        </Page>
      </context.Provider>
    );
  }
}

const DynamicPage = connect(({ layouts, details, lists }: StoreState) => ({ layouts, details, lists }))(OriginalDynamicPage);

export default DynamicPage;

app.components.DynamicPage = DynamicPage;
