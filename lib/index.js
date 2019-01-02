"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
exports.React = React;
var ReactDOM = require("react-dom");
var hydux_1 = require("hydux");
function shallowDiffers(a, b) {
    for (var i in a)
        if (!(i in b))
            return true;
    for (var i in b)
        if (i !== 'children' && a[i] !== b[i])
            return true;
    return false;
}
/**
 * @deprecated Deprecated for React.memo
 */
var PureView = /** @class */ (function (_super) {
    __extends(PureView, _super);
    function PureView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PureView.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
        return shallowDiffers(this.props.stateInUse, nextProps.stateInUse);
    };
    PureView.prototype.render = function () {
        var _a = this.props, children = _a.children, stateInUse = _a.stateInUse;
        return typeof children === 'function' ? children(stateInUse) : children;
    };
    return PureView;
}(React.Component));
exports.PureView = PureView;
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            error: void 0,
            errorInfo: void 0
        };
        return _this;
    }
    ErrorBoundary.prototype.report = function (error, errorInfo) {
        var report = this.props.report;
        if (report) {
            return report(error, errorInfo);
        }
        console.error(error, errorInfo);
    };
    ErrorBoundary.prototype.render = function () {
        var _a = this.state, error = _a.error, errorInfo = _a.errorInfo;
        var _b = this.props, report = _b.report, renderMessage = _b.renderMessage, children = _b.children;
        if (!error) {
            try {
                return typeof children === 'function' ? children() : children;
            }
            catch (err) {
                error = err;
                this.report(error, errorInfo);
            }
        }
        return renderMessage ? renderMessage(error, errorInfo) : null;
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        this.setState({ error: error, errorInfo: errorInfo });
        this.report(error, errorInfo);
    };
    return ErrorBoundary;
}(React.Component));
exports.ErrorBoundary = ErrorBoundary;
var HyduxComponent = /** @class */ (function (_super) {
    __extends(HyduxComponent, _super);
    function HyduxComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            state: null
        };
        return _this;
    }
    HyduxComponent.prototype.componentWillMount = function () {
        var _this = this;
        this.setState({
            state: this.init(this.props),
        });
        this.ctx = hydux_1.default({
            init: function () { return _this.init(_this.props); },
            actions: this.actions,
            view: hydux_1.noop,
            onRender: function (_) {
                if (!_this.ctx) {
                    return;
                }
                _this.setState({
                    state: _this.ctx.state,
                });
            }
        });
    };
    HyduxComponent.prototype.render = function () {
        return this.view(this.props, this.state.state, this.ctx.actions);
    };
    return HyduxComponent;
}(React.PureComponent));
exports.HyduxComponent = HyduxComponent;
// hack for hmr
var _container;
var mounted = false;
function withReact(container, options) {
    if (options === void 0) { options = {}; }
    container = container || _container;
    if (!container) {
        container = _container = document.createElement('div');
        document.body.appendChild(container);
    }
    options = __assign({ hydrate: false }, options);
    var render = options.hydrate
        ? ReactDOM.hydrate
        : ReactDOM.render;
    var UpdateEvent = '@hydux-react/update-state';
    if (options.useComponent) {
        var Root = /** @class */ (function (_super) {
            __extends(Root, _super);
            function Root() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.state = {
                    state: {},
                    actions: {},
                    view: function (s, a) { return null; },
                };
                _this.view = function () { return null; };
                return _this;
            }
            Root.prototype.componentDidMount = function () {
                var _this = this;
                document.addEventListener(UpdateEvent, function (e) {
                    _this.setState(e.detail);
                });
            };
            Root.prototype.render = function () {
                return this.state.view(this.state.state, this.state.actions);
            };
            return Root;
        }(React.Component));
        if (!mounted) {
            mounted = true;
            render(React.createElement(Root, null), container);
        }
    }
    return function (app) { return function (props) { return app(__assign({}, props, { view: options.useComponent ? (function (state, actions) {
            return {
                view: props.view,
                state: state,
                actions: actions,
            };
        }) : props.view, onRender: function (view) {
            props.onRender && props.onRender(view);
            if (options.useComponent) {
                document.dispatchEvent(new CustomEvent(UpdateEvent, {
                    detail: view
                }));
                return;
            }
            // ReactDOM.render is already batched
            // if wrapped by rAF it might break input's value and onChange
            return render(view, container);
        } })); }; };
}
exports.default = withReact;
//# sourceMappingURL=index.js.map