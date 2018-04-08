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
var PureComp = /** @class */ (function (_super) {
    __extends(PureComp, _super);
    function PureComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PureComp;
}(React.PureComponent));
function PureView(props) {
    return (React.createElement(PureComp, __assign({}, props), props.children));
}
exports.PureView = PureView;
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
function withReact(container, options) {
    container = container || _container;
    if (!container) {
        container = _container = document.createElement('div');
        document.body.appendChild(container);
    }
    options = __assign({ hydrate: false }, options);
    var render = options.hydrate
        ? ReactDOM.hydrate
        : ReactDOM.render;
    return function (app) { return function (props) { return app(__assign({}, props, { onRender: function (view) {
            props.onRender && props.onRender(view);
            // ReactDOM.render is already batched
            // if wrapped by rAF it might break input's value and onChange
            return render(view, container);
        } })); }; };
}
exports.default = withReact;
//# sourceMappingURL=index.js.map