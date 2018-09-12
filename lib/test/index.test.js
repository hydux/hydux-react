"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var memoize_1 = require("../memoize");
var assert = require("assert");
describe('memoize', function () {
    it('number', function () {
        var action = function (f) { return f; };
        var cb1 = memoize_1.default(action, 1);
        var cb2 = memoize_1.default(action, 1);
        var cb3 = memoize_1.default(action, 2);
        assert.equal(cb1, cb2);
        assert.notEqual(cb1, cb3);
    });
    it('object + string', function () {
        var action = function (f, str) { return f; };
        var obj1 = {};
        var cb1 = memoize_1.default(action, obj1, 'aaa');
        var cb2 = memoize_1.default(action, obj1, 'aaa');
        var cb3 = memoize_1.default(action, {}, 'bbb');
        assert.equal(cb1, cb2);
        assert.notEqual(cb1, cb3);
    });
});
//# sourceMappingURL=index.test.js.map