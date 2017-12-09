"use strict";
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
exports.React = react_1.default;
var react_dom_1 = require("react-dom");
// work for hmr
var _container;
function withReact(container) {
    container = container || _container;
    if (!container) {
        container = _container = document.createElement('div');
        document.body.appendChild(container);
    }
    return function (app) { return function (props) { return app(__assign({}, props, { onRender: function (view) {
            console.log(view);
            props.onRender && props.onRender(view);
            return react_dom_1.default.render(view, container);
        } })); }; };
}
exports.default = withReact;
//# sourceMappingURL=index.js.map