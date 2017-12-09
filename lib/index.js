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
var react_1 = require("react");
var react_dom_1 = require("react-dom");
// Fix React's default export doesn't work with typescript loader
exports.React = { createElement: react_1.createElement };
var PureComp = /** @class */ (function (_super) {
    __extends(PureComp, _super);
    function PureComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PureComp;
}(react_1.PureComponent));
function PureView(props) {
    return (exports.React.createElement(PureComp, __assign({}, props.state), props.children));
}
exports.PureView = PureView;
// work for hmr
var _container;
function withReact(container) {
    container = container || _container;
    if (!container) {
        container = _container = document.createElement('div');
        document.body.appendChild(container);
    }
    return function (app) { return function (props) { return app(__assign({}, props, { onRender: function (view) {
            props.onRender && props.onRender(view);
            return react_dom_1.render(view, container);
        } })); }; };
}
exports.default = withReact;
//# sourceMappingURL=index.js.map