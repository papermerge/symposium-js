import { assert } from "chai";

import { Model } from '../symposium/model';


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


describe("Events test suite", () => {

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

});
