import { assert } from "chai";

import {
    applyMixins,
    isFunction,
    uniqueId
} from '../symposium/js/utils';


describe("test/utils_test.js", () => {

  it("tests isFunction", () => {
    let func = function(){},
        some_obj = {};

    assert.isTrue(
        isFunction(func)
    );
    assert.isFalse(
        isFunction(some_obj)
    );
  }); // test isFunction

  it("tests uniqueId", () => {
    assert.equal(
        1,
        uniqueId()
    );
    assert.equal(
        2,
        uniqueId()
    );
    assert.equal(
        3,
        uniqueId()
    );
  }); // test uniqueId

  it("tests applyMixins", () => {
    let instance;

    class BaseClass {
        foo() {};
    };

    class Mixin1 {
        mixin1() {};
    };

    class Mixin2 {
        mixin2() {};
    };

    applyMixins(BaseClass, [Mixin1, Mixin2]);

    instance = new BaseClass();

    assert.isFunction(instance.foo);
    assert.isFunction(instance.mixin1);
    assert.isFunction(instance.mixin2);
  }); // test applyMixins
});