import { assert } from "chai";

import { Collection, Model } from '../../symposium/index';
import { Breadcrumb } from '../../symposium/index';


class Folder extends Model {

    constructor({
        id,
        title,
    }) {
        super();
        this.id = id;
        this.title = title;
    }
}


describe("Breadcrumb model test suite", () => {

  it("Can instanciate an empty Breadcrumb model", () => {

    let breadcrumb = new Breadcrumb();

    assert.isDefined(breadcrumb);
  }); // it

  it("Can reset breadcrumb to given set of items", () => {
    let breadcrumb = new Breadcrumb(),
        collection = new Collection(),
        arr = [];

    arr.push(new Folder({id: 1, title: "My Documents"}))
    arr.push(new Folder({id: 2, title: "Payments"}));
    arr.push(new Folder({id: 3, title: "Invoices"}));
    collection.add(arr);

    breadcrumb.reset(collection);

    assert.equal(
        breadcrumb.length,
        collection.length
    );
  }); // it

  it("Can change_parent", () => {
    let breadcrumb = new Breadcrumb(),
        collection = new Collection(),
        arr = [],
        folder_1,
        folder_2,
        folder_3;

    folder_1 = new Folder({id: 1, title: "My Documents"});
    folder_2 = new Folder({id: 2, title: "Payments"});
    folder_3 = new Folder({id: 3, title: "Invoices"});

    arr.push(folder_1)
    arr.push(folder_2);
    arr.push(folder_3);
    collection.add(arr);

    breadcrumb.reset(collection);

    assert.equal(
        breadcrumb.length,
        3,
        "breadcrumb.length != 3"
    );
    assert.equal(breadcrumb.parent.id, 3);
    assert.equal(
        breadcrumb.first().id,
        folder_1.id,
    );
    assert.equal(
        breadcrumb.last().id,
        folder_3.id,
    );

    breadcrumb.change_parent(folder_2);
    assert.equal(
        breadcrumb.length,
        2,
        "breadcrumb.length != 2"
    );
    assert.equal(
        breadcrumb.last().id,
        folder_2.id,
    );
  }); //it

  it("Can change_parent to root folder", () => {
    let breadcrumb = new Breadcrumb(),
        collection = new Collection(),
        arr = [],
        folder_1,
        folder_2,
        folder_3;

    folder_1 = new Folder({id: 1, title: "My Documents"});
    folder_2 = new Folder({id: 2, title: "Payments"});
    folder_3 = new Folder({id: 3, title: "Invoices"});

    arr.push(folder_1)
    arr.push(folder_2);
    arr.push(folder_3);
    collection.add(arr);

    breadcrumb.reset(collection);
    assert.equal(
        breadcrumb.length,
        3,
        "breadcrumb.length != 3"
    );

    // explicitely change parent to root folder
    // same as calling `change_parent()` without
    // arguments
    breadcrumb.change_parent(undefined);
    assert.equal(
        breadcrumb.length,
        0,
        "breadcrumb.length != 0"
    );
  }); // it

  it("triggers change-parent event when changing parent", () => {
    let breadcrumb = new Breadcrumb(),
        folder_1,
        folder_2,
        folder_3,
        counter = 0;

    folder_1 = new Folder({id: 1, title: "My Documents"});
    folder_2 = new Folder({id: 2, title: "Payments"});
    folder_3 = new Folder({id: 3, title: "Invoices"});

    breadcrumb.add(folder_1)
    breadcrumb.add(folder_2);
    breadcrumb.add(folder_3);
    /*
    Everytime when changing parent, breadcrumb model
    generates an "change" event.
    */
    breadcrumb.on("change-parent", () => { counter++;} );
    breadcrumb.change_parent( // will increment counter
        new Folder({id: 1, title: "My Documents"})
    );
    breadcrumb.change_parent(); // will increment counter
    assert.equal(
        counter,
        2,
        "change event was NOT triggered twice"
    );

  }); // it

}); // describe
