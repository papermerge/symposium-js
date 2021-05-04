import { assert } from "chai";

import { Model } from '../symposium/model';


class SomeModel extends Model {
  constructor(counter=0) {
    super();
    this.counter = counter;
  }
}

describe("Events test suite", () => {

  it("Can bind/trigger events on class which extends Events", () => {
    let some_model = new SomeModel();

    some_model.on('event', function() { this.counter += 1; });
    some_model.trigger('event');
    assert.equal(
      some_model.counter,
      1,
      'counter should be incremented.'
    );

    some_model.trigger('event');
    some_model.trigger('event');
    assert.equal(
      some_model.counter,
      3,
      'counter should be incremented.'
    );
  });

});
