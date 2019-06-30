"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _ = require("lodash");
const qs = require("qs");
const EventEmitter = require("events");
const shallowEqualWithout = require("shallow-equal-without");
const react_redux_1 = require("react-redux");
const app_1 = require("@samoyed/app");
const box_1 = require("@samoyed/box");
const page_1 = require("@samoyed/page");
const select_list_1 = require("@samoyed/utils/select-list");
exports.context = React.createContext({});
class OriginalDynamicPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleRefresh = (cb) => {
            let { pageRecord } = this.props;
            let { id, search, filters, sort, limit } = this.state;
            if (pageRecord.type === 'detail') {
                app_1.default.actions.loadDetail({ model: pageRecord.source, id, callback: cb });
            }
            else if (pageRecord.type === 'list') {
                app_1.default.actions.loadList({ model: pageRecord.source, search, filters, sort, limit, callback: cb });
            }
        };
        this.handleLoadMore = () => {
            let { list } = this.state;
            if (list.next) {
                app_1.default.actions.loadMore({ model: list.model, list });
            }
        };
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
            contextValue: {
                scrollEvents: this.scrollEvents,
                pageTitle: '',
                setPageTitle: (title) => {
                    let c = this.state.contextValue;
                    if (title === c.pageTitle)
                        return;
                    this.setState({
                        contextValue: Object.assign({}, c, { pageTitle: title })
                    });
                    document.title = title;
                }
            }
        };
    }
    static getDerivedStateFromProps(nextProps, preState) {
        const { pageRecord, details, lists, layouts, match } = nextProps;
        let nextState = {
            id: match.params.id,
            active: nextProps.active,
            last: nextProps.last,
        };
        let query = qs.parse(location.search.substr(1));
        if (!_.isEqual(query, preState.query)) {
            nextState.query = query;
        }
        if (pageRecord.type === 'detail') {
            nextState.detail = _.get(details[pageRecord.source], match.params.id, null);
        }
        if (pageRecord.type === 'list') {
            nextState.sort = query._sort || '';
            nextState.search = query._search || '';
            nextState.limit = parseInt(query._limit) || app_1.default.defaults.listLimit;
            let filters = {};
            _.forEach(query, (v, k) => {
                if (k[0] === '_')
                    return;
                filters[k] = v;
            });
            if (_.isEmpty(filters)) {
                filters = null;
            }
            nextState.list = select_list_1.default(lists[pageRecord.source], {
                search: nextState.search,
                filters,
                limit: nextState.limit,
                sort: nextState.sort
            });
            if (!_.isEqual(filters, preState.filters)) {
                nextState.filters = filters;
            }
        }
        let detail = nextState.detail;
        if (detail && detail.layout) {
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
    shouldComponentUpdate(props, state) {
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
            app_1.default.actions.loadDetail({ model: pageRecord.source, id });
        }
        else if (pageRecord.type === 'list' && !list) {
            app_1.default.actions.loadList({ model: pageRecord.source, search, filters, sort, limit });
        }
    }
    renderLoading() {
        let components = this.props.components || app_1.default.components;
        let LoadingPage = components.LoadingPage;
        if (LoadingPage)
            return React.createElement(LoadingPage, null);
        return 'Loading';
    }
    render() {
        const { pageRecord, router, active } = this.props;
        const { layoutRecord, detail, list, id, query, contextValue } = this.state;
        if (pageRecord.type === 'detail' && !id)
            return '路由中不存在id参数';
        if (pageRecord.type === 'detail' && !detail)
            return this.renderLoading();
        if (pageRecord.type === 'list' && !list)
            return this.renderLoading();
        if (!layoutRecord)
            return 'Missing layout!';
        if (active) {
            let pageTitle = contextValue.pageTitle;
            if (detail) {
                pageTitle = detail.title;
            }
            if (!pageTitle) {
                pageTitle = pageRecord.title;
            }
            console.log('active', active);
            console.log('pageTitle', pageTitle);
            if (document.title !== pageTitle) {
                document.title = pageTitle;
            }
        }
        const components = this.props.components || app_1.default.components;
        const refs = Object.assign({}, this.props, this.state);
        const onPullRefresh = (pageRecord.type === 'list' || pageRecord.type === 'detail') ? this.handleRefresh : undefined;
        const onReachBottom = (pageRecord.type === 'list') ? this.handleLoadMore : undefined;
        const pullRefreshTexts = components.PullRefresh;
        const others = _.omit(this.props, 'dispatch', 'details', 'lists', 'layouts', 'pageRecord', 'components', 'history', 'location', 'match', 'staticContext', 'router');
        let dockTop = [];
        let dockBottom = [];
        let center = [];
        layoutRecord.items.forEach((item) => {
            let Component = components[item.component];
            if (!Component) {
                console.error(`Missing component: ${item.component}`);
                return;
            }
            let itemProps = {
                key: item.id
            };
            _.forEach(item.props, (p, k) => {
                let value = p.value;
                if (p.type === 'ref') {
                    value = _.get(refs, p.ref);
                }
                itemProps[k] = value;
            });
            let style = {};
            let backgroundImage;
            _.forEach(item.style, (p, k) => {
                let value = p.value;
                if (p.type === 'ref') {
                    value = _.get(refs, p.ref);
                }
                if (k === 'backgroundImage') {
                    backgroundImage = `url(${value})`;
                }
                else {
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
            }
            else if (item.position === 'dock-bottom') {
                dockBottom.push(el);
            }
            else {
                center.push(el);
            }
        });
        if (onReachBottom) {
            let LoadMore = components.LoadMore;
            if (LoadMore) {
                center.push(React.createElement(LoadMore, { key: "load-more", list: list }));
            }
        }
        let bodyStyle = {};
        let backgroundImage;
        _.forEach(layoutRecord.style, (p, k) => {
            let value = p.value;
            if (p.type === 'ref') {
                value = _.get(refs, p.ref);
            }
            if (k === 'backgroundImage') {
                backgroundImage = `url(${value})`;
            }
            else {
                bodyStyle[k] = value;
            }
        });
        if (backgroundImage) {
            bodyStyle.backgroundImage = backgroundImage;
        }
        if (!_.size(bodyStyle)) {
            bodyStyle = null;
        }
        let NavBar = components[layoutRecord.navBar];
        if (NavBar && !query._noNavBar) {
            dockTop.unshift(React.createElement(NavBar, { key: "navbar", title: contextValue.pageTitle, list: list, detail: detail, layoutRecord: layoutRecord, pageRecord: pageRecord, router: router }));
        }
        return (React.createElement(exports.context.Provider, { value: contextValue },
            React.createElement(page_1.default, Object.assign({ layout: "vertical" }, others),
                dockTop,
                React.createElement(box_1.default, { flex: true, className: "page-content", layout: "vertical", scrollable: "vertical", onPullRefresh: onPullRefresh, pullRefreshTexts: pullRefreshTexts, onReachBottom: onReachBottom, reachBottomBorder: 50, bodyStyle: bodyStyle, onBodyScroll: (data) => this.scrollEvents.emit('scroll', data) }, center),
                dockBottom)));
    }
}
exports.OriginalDynamicPage = OriginalDynamicPage;
const DynamicPage = react_redux_1.connect(({ layouts, details, lists }) => ({ layouts, details, lists }))(OriginalDynamicPage);
exports.default = DynamicPage;
app_1.default.components.DynamicPage = DynamicPage;
