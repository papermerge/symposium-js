import { assert } from "chai";

import { Model } from '../symposium/js/model';
import { ValueError } from "../symposium/js/exceptions";


class SomeModel extends Model {
  constructor(counter=0) {
    super();
    this.counter = counter;
  }
}


class TwoCountersModel extends Model {

  constructor(counter_1=0, counter_2=0) {
    super();

    this.counter_1 = counter_1;
    this.counter_2 = counter_2;
  }
}


describe("Eventful test suite", () => {

  it("Can bind/trigger events on class which extends Events", () => {
    let some_model = new SomeModel();

    some_model.on('some_event', function() { this.counter += 1; });
    some_model.trigger('some_event');
    assert.equal(
      some_model.counter,
      1,
      'counter should be incremented.'
    );

    some_model.trigger('some_event');
    some_model.trigger('some_event');
    assert.equal(
      some_model.counter,
      3,
      'counter should be incremented.'
    );
  });

  it("Triggers correct handler", () => {
    /* given two events event_1 and event_2, when
      event event_1 is fired - correct handler is triggered i.e.
      only handler for event_1 is triggered
    */
    let model = new TwoCountersModel();

    model.on("event_1", function() { this.counter_1 += 1; });
    model.on("event_2", function() { this.counter_2 += 1; });

    model.trigger("event_1");
    model.trigger("event_1");

    assert.equal(
      model.counter_1,
      2
    );

    assert.equal(
      model.counter_2,
      0
    );
  });

  it("Listen on all events.", () => {
    let model = new SomeModel();

    model.on("all", function() { this.counter += 1; });

    model.trigger("some_event_1");
    model.trigger("some_event_2");

    assert.equal(
      model.counter,
      2,
      "triggering events must fire handler attached to 'all'"
    );
  });

  it("Considers the case when 'all' handlers exists along with others", () => {
    let model = new TwoCountersModel();

    model.on("all", function() { this.counter_1 += 1; });
    model.on("some_event_2", function() { this.counter_2 += 1; });

    model.trigger("some_event_1");
    model.trigger("some_event_1");
    model.trigger("some_event_2");
    model.trigger("some_event_2");

    assert.equal(
      model.counter_1,
      4, // incremented by handler attached two 'all'
      "triggering events must fire handler attached to 'all'"
    );

    assert.equal(
      model.counter_2,
      2, // incremented by handler attached two 'some_event_2'
      "triggering some_event_2 must fire only correct handler"
    );
  });

  it("minds garbage input for trigger function", () => {
    let some_model = new SomeModel();

    some_model.on('some_event', function() { this.counter += 1; });

    assert.throws(
      () => { some_model.trigger(1001); },
      ValueError, // exception to be thrown
      /Expects/i // message of the exeption
    );

    assert.throws(
      () => { some_model.trigger({x: 1001}); },
      ValueError, // exception to be thrown
      /Expects/i // message of the exeption
    );

    assert.throws(
      () => { some_model.trigger(''); },
      ValueError,
      /Expects/i
    );

    assert.throws(
      () => { some_model.trigger(); },
      ValueError,
      /Expects/i
    );
  });

  it("removes all event listensers with off", () => {
    let some_model = new SomeModel();

    some_model.on('some_event', function() { this.counter += 1; });
    some_model.trigger('some_event');
    some_model.trigger('some_event');
    assert.equal(
      some_model.counter,
      2,
      'counter should be incremented.'
    );
    some_model.off();
    some_model.trigger('some_event');
    some_model.trigger('some_event');

    assert.equal(
      some_model.counter,
      2,
      'counter should have stayed same, equal to 2.'
    );
  });

  it("removes specificaly named event listener with off", () => {
    let some_model = new TwoCountersModel();

    some_model.on('event_1', function() { this.counter_1 += 1; });
    some_model.on('event_2', function() { this.counter_2 += 1; });

    some_model.trigger('event_1');
    some_model.trigger('event_2');
    some_model.trigger('event_2');

    assert.equal(
      some_model.counter_1,
      1,
      'counter should be incremented.'
    );
    assert.equal(
      some_model.counter_2,
      2,
      'counter should be incremented.'
    );
    some_model.off("event_2");

    // listener for event_1 is still there
    some_model.trigger('event_1');
    some_model.trigger('event_1');
    // there is no such event listeners anymore
    some_model.trigger('event_2');
    some_model.trigger('event_2');

    assert.equal(
      some_model.counter_1,
      3,
      'Counter 1 should have been incremented.'
    );
    assert.equal(
      some_model.counter_2,
      2,
      'Counter 2 should have stayed same.'
    );
  });

  it("removes boths named event listener with off", () => {
    let some_model = new TwoCountersModel();

    some_model.on('event_1', function() { this.counter_1 += 1; });
    some_model.on('event_2', function() { this.counter_2 += 1; });

    some_model.trigger('event_1');
    some_model.trigger('event_2');
    some_model.trigger('event_2');

    assert.equal(
      some_model.counter_1,
      1,
      'counter should be incremented.'
    );
    assert.equal(
      some_model.counter_2,
      2,
      'counter should be incremented.'
    );
    some_model.off();

    // listener for event_1 is still there
    some_model.trigger('event_1');
    some_model.trigger('event_1');
    // there is no such event listeners anymore
    some_model.trigger('event_2');
    some_model.trigger('event_2');

    assert.equal(
      some_model.counter_1,
      1,
      'Counter 1 should have stayed same.'
    );
    assert.equal(
      some_model.counter_2,
      2,
      'Counter 2 should have stayed same.'
    );
  });

  it("is ok to call -off- multiple times before -on-", () => {
    let some_model = new SomeModel();

    /*
      make sure there is no exception thrown when
      `off` was called before `on`.
    */
    some_model.off();
    some_model.off();
  });

  it("is ok to call named -off- before -on-", () => {
    let some_model = new SomeModel();

    /*
      make sure there is no exception thrown when
      `off` was called with an argument before `on`.
    */
    some_model.off("some_event");
  });

}); // Eventful test suite
