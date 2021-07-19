import { assert } from "chai";

import { Model, Collection } from '../symposium/index';


class Folder extends Model {

    constructor({id, title}) {
        super();
        this.id = id;
        this.title = title;
    }
}

class Document extends Model {

    constructor({id, title}) {
        super();
        this._id = id;
        this._title = title;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
        this.trigger("change", this, "id", value);
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
        this.trigger("change", this);
    }

    toString() {
        return `Document(id=${this.id}, title=${this.title})`;
    }
}


describe("test/collection_test.js", () => {

    it("Can instanciate a empty Collection", () => {

        let col = new Collection();

        assert.isDefined(col);
    });

    it("Can add items to the collection", () => {
        let col = new Collection();

        col.add(new Document({id: 1, title: "invoice.pdf"}));
        col.add(new Folder({id: 2, title: "My Documents"}));

        assert.equal(col.length, 2);
    });

    it("Can add an array to the collection", () => {
        let col = new Collection(), arr = [];

        arr.push(new Document({id: 1, title: "invoice.pdf"}));
        arr.push(new Folder({id: 2, title: "My Documents"}));

        col.add(arr);

        assert.equal(col.length, 2);
        assert.equal(col[0].title, "invoice.pdf");
    });

    it("Can get item by attributes", () => {
        let col = new Collection(),
            arr = [],
            doc1,
            doc2;

        arr.push(
            new Document({id:1, title:"doc1.pdf"})
        );
        arr.push(
            new Document({id:2, title:"doc2.pdf"})
        );

        col.add(arr);
        // get by id
        doc1 = col.get({id: 1});

        assert.isDefined(doc1);
        assert.equal(doc1.id, 1);

        // get by title
        doc2 = col.get({title: "doc2.pdf"});

        assert.isDefined(doc2);
        assert.equal(doc2.id, 2);
    });

    it("Compares attributes as strings", () => {
        // .get method compares attrbitutes as strings
        // i.e. col.get({id: 1}) is same as col.get({id: "1"})
        let col = new Collection(),
            arr = [],
            doc1,
            doc2;

        arr.push(
            new Document({id:1, title:"doc1.pdf"})
        );
        arr.push(
            new Document({id:2, title:"doc2.pdf"})
        );

        col.add(arr);
        // get by id
        doc1 = col.get({id: 1});

        assert.isDefined(doc1);
        assert.equal(doc1.id, 1);

        // get by id, but id is passed as string, not as integer
        doc2 = col.get({id: "1"});

        assert.isDefined(doc2);
        assert.equal(doc2.id, 1);
    });

    it("Ignores undefined attributes", () => {
        // .get method will ignore attrbitutes with undefined value
        // i.e. col.get({id: 1}) is same as col.get({id: 1, title: undefined})
        let col = new Collection(),
            arr = [],
            doc1,
            doc2;

        arr.push(
            new Document({id:1, title:"doc1.pdf"})
        );
        arr.push(
            new Document({id:2, title:"doc2.pdf"})
        );

        col.add(arr);
        // get by id
        doc1 = col.get({id: 1});

        assert.equal(doc1.id, 1);

        // get by id, but id is passed as string, not as integer
        doc2 = col.get({id: 1, title: undefined});

        assert.isDefined(doc2, "doc2 was not found");
        assert.equal(doc2.id, 1);
    });

    it("Returns undefined when there is only one undefined attribute", () => {
        let col = new Collection(),
            arr = [],
            found;

        arr.push(
            new Document({id:1, title:"doc1.pdf"})
        );
        arr.push(
            new Document({id:2, title:"doc2.pdf"})
        );

        col.add(arr);
        found = col.get({id: undefined});

        assert.isUndefined(found);
    });

    it("Returns correctly first item", () => {
        let col = new Collection(), first;

        col.add(new Folder({id: 1, title: "My Documents"}));
        col.add(new Folder({id: 1, title: "Payments"}));
        col.add(new Folder({id: 1, title: "Invoices"}));

        first = col.first();
        assert.equal(first.title, "My Documents");
    });

    it("Returns correctly last item", () => {
        let col = new Collection(), last;

        col.add(new Folder({id: 1, title: "My Documents"}));
        col.add(new Folder({id: 1, title: "Payments"}));
        col.add(new Folder({id: 1, title: "Invoices"}));

        last = col.last();
        assert.equal(last.title, "Invoices");
    });

    it("can reset collection", () => {
        let col = new Collection(), last;

        col.add(new Folder({id: 1, title: "My Documents"}));
        col.add(new Folder({id: 1, title: "Payments"}));
        col.add(new Folder({id: 1, title: "Invoices"}));

        assert.equal(col.length, 3, "collection does not have 3 items");
        col.reset()
        assert.equal(col.length, 0, "collection was not reset");
    });

    it("accepts an empty array as argument for reset", () => {
        let col = new Collection();

        col.add([1, 2, 3, 4]);

        assert.equal(col.length, 4, "collection does not have 4 elements");
        // reset collection i.e. make it empty
        col.reset([]);
        assert.equal(col.length, 0, "collection is expected to be empty");
    });

    it("Fires 'change' event when collection item changes", () => {
        let col = new Collection(),
        arr = [
            new Document({id: 1, title: "invoice_1.pdf"}),
            new Document({id: 2, title: "invoice_2.pdf"}),
        ],
        counter,
        doc,
        incr_hdl; // increment handler

        col.add(arr);
        counter = {value: 0};

        incr_hdl = function() {
            this.value += 1;
        };

        // Here is the heart of what we test.
        // We test that 'change' event is fired
        // when collection's item changes i.e. collection
        // item fires 'change' event.
        // In this regard, collection serves as proxy
        // of its items' events
        col.on("change", incr_hdl, counter);

        doc = col.first();

        // title attribute assignment triggers 'change' event on the model
        // which in turn should trigger collections' 'change'
        // which in turn will incr counter with 1
        doc.title = "renamed.pdf";

        assert.equal(
            counter.value,
            1,
            "Collection must fire change handler when collection's item changed."
        );

        doc.title = "renamed_2.pdf";
        assert.equal(
            counter.value,
            2,
            "Collection must fire change handler for second time."
        );
    });

    it("Fires 'change' event with item as argument", () => {
        let col = new Collection(),
        arr = [
            new Document({id: 1, title: "invoice_1.pdf"}),
            new Document({id: 2, title: "invoice_2.pdf"}),
        ],
        doc,
        func_hdl,
        counter = 0;

        col.add(arr);
        doc = col.first();

        assert.equal(
            doc.title,
            "invoice_1.pdf",
            "First item added is expected to be invoice_1.pdf"
        );

        func_hdl = function(item) {
            assert.isDefined(
                item,
                "First argument passed to the handler must be a Document instance!"
                );
            assert.equal(
                item.title,
                "new_title.pdf",
                "item is expected to be doc with title='new_title.pdf'"
            );
            assert.equal(
                item.id,
                1,
                "item is expected to be doc with id=1"
            );
            counter += 1;
        }; // func_hdl

        col.on("change", func_hdl, this);
        doc.title = "new_title.pdf"; // triggers 'change' event on the Document

        assert.equal(
            counter,
            1,
            "Handler was not invoked!"
        );
    });

    it("Fires 'reset' event when collections resets", () => {
        let col = new Collection(),
            counter,
            incr_hdl = function() { this.value += 1; };

        counter = {value: 0};
        col.on("reset", incr_hdl, counter);

        assert.equal(
            counter.value,
            0
        );
        col.reset([1, 2, 3]);

        assert.equal(
            counter.value,
            1,
            "Event reset not fired by the collection"
        );
    });

    it("Fires 'add' event when items are added", () => {
        let col = new Collection(),
            counter,
            incr_hdl = function() { this.value += 1; };

        counter = {value: 0};
        col.on("add", incr_hdl, counter);

        assert.equal(
            counter.value,
            0
        )
        col.add("item-1");
        col.add("item-2");
        col.add("item-3");

        assert.equal(
            counter.value,
            3,
            "Event add not fired by the collection"
        );
    });

    it("Fires 'add' event for each item added", () => {
        let col = new Collection(),
            counter,
            incr_hdl = function() { this.value += 1; };

        counter = {value: 0};
        col.on("add", incr_hdl, counter);

        assert.equal(
            counter.value,
            0
        )
        col.add(["item-1", "item-2", "item-3"]);

        assert.equal(
            counter.value,
            3,
            "Event add not fired by the collection"
        );
    });

    it("can remove elements from collection", () => {
        let col = new Collection();

        col.add({id: 1});
        col.add({id: 2});
        col.add({id: 3});
        col.add({id: 4});
        col.add({id: 5});

        assert.equal(col.length, 5);
        col.remove(
            [{id: 3}, {id: 5}],
            (elem) => { return elem.id }
        );

        assert.equal(
            col.length,
            3,
            "Two elements were not removed"
        );

        assert.isTrue(
            col.findIndex((item) => {
                return item.id === 1;
            }) >= 0,
            "Item with id == 1 is not in collection :("
        );

        assert.isTrue(
            col.findIndex((item) => {
                return item.id === 2;
            }) >= 0,
            "Item with id == 2 is not in collection :("
        );

        assert.isTrue(
            col.findIndex((item) => {
                return item.id === 4;
            }) >= 0,
            "Item with id == 4 is not in collection :("
        );

        assert.isFalse(
            col.findIndex((item) => {
                return item.id === 3;
            }) >= 0,
            "Item with id == 3 is in collection :("
        );

        assert.isFalse(
            col.findIndex((item) => {
                return item.id === 5;
            }) >= 0,
            "Item with id == 5 is in collection :("
        );
    });

    it("C1: 'change' on removed model does not affect collection", () => {
        // Scenario:
        // Collection has 3 models.
        // When each of this models is changed (i.e. model fires a 'change' event)
        // that `change` event is proxied to collection.
        // If a model is removed from collection - proxying of `change` event
        // does not happen
        let col = new Collection(),
            doc1,
            doc2,
            arr = [],
            counter = 0;

        doc1 = new Document({id: 1, title: "invoice_1.pdf"});
        doc2 = new Document({id: 2, title: "invoice_2.pdf"});

        arr = [doc1, doc2];

        col.add(arr);
        col.on("change", () => { counter++; });

        doc2.title = "invoice_2A.pdf"; // triggers `change` on collection
        doc2.title = "invoice_2B.pdf"; // triggers `change` again

        assert.equal(
            counter,
            2,
            "`change` event was not triggered two times"
        );

        // remove doc2 from collection
        col.remove(doc2);

        // should NOT trigger `change` event on collection
        doc2.title = "invoice_2C.pdf";
        doc2.title = "invoice_2D.pdf";

        assert.equal(
            counter,
            2,
            "`change` event of removed model affected collection :("
        );
    });

    it("C2 'change' on removed models does not affect collection", () => {
        let col = new Collection(),
            doc1,
            doc2,
            doc3,
            arr = [],
            counter = 0;

        doc1 = new Document({id: 1, title: "invoice_1.pdf"});
        doc2 = new Document({id: 2, title: "invoice_2.pdf"});
        doc3 = new Document({id: 2, title: "invoice_3.pdf"});

        arr = [doc1, doc2, doc3];

        col.add(arr);
        col.on("change", () => { counter++; });

        assert.equal(counter, 0);
        doc2.title = "invoice_2A.pdf"; // triggers `change` on collection
        doc2.title = "invoice_2B.pdf"; // triggers `change` again
        doc1.title = "invoice_1A.pdf"; // triggers `change` on collection

        assert.equal(
            counter,
            3,
            "`change` event was not triggered 4 times"
        );

        // remove doc1 and doc2 from collection
        col.remove([doc1, doc2]);

         assert.equal(counter, 3);
        // should NOT trigger `change` event on collection
        doc2.title = "invoice_2C.pdf";
        doc2.title = "invoice_2D.pdf";
        doc1.title = "invoice_1B.pdf";
        doc1.title = "invoice_1C.pdf";

        // counter stays same
        assert.equal(
            counter,
            3,
            "`change` event of removed model affected collection :("
        );
    });

    it("When removing non models items need to pass get function", () => {
        let col = new Collection(),
            arr = [];

        col.add(["item-1", "item-2", "item-3"]);

        assert.equal(col.length, 3);

        col.remove(
            ["item-1", "item-2"],
            // non default get function. Without it
            // collection will try to match items with item1.id == item2.id
            (i) => { return i; }
        );

        assert.equal(
            col.length,
            1,
            "Two collection items were not removed :("
        );
    });
});