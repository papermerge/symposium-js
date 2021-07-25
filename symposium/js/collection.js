import { Eventful } from "./eventful";
import { applyMixins, is_non_empty_array } from "./utils";


function default_get_fn(value) {
    return value.id;
}


class Collection extends Array {
    /*
    Collection is sort of Array with couple of extras.

    One of the greatest benefit of collection over array
    is collection's ability to trigger events.
    Collection fires following events:

        * 'add' - when a new item is added.
        * 'remove' - when item is removed from collection.
        * 'reset' - when entire collection resets.
        * 'change' - when item in collection fires 'change' event.
    */

    constructor(...args) {
        if (Array.isArray(args) && args.length > 0) {
            super(args);
        } else {
            super(0);
        }
    }

    add(item_or_items, {silent}={silent: false}) {
        let that = this;

        if (Array.isArray(item_or_items)) { // if an array
            item_or_items.map((item) => {
                that.push(item);
                if (item['on']) {
                    item.on(
                        "change",
                        that._on_model_change_event,
                        {collection: that, item: item}
                    );
                }
                if (!silent) {
                    console.log("Triggering add event");
                    this.trigger("add", item);
                } else {
                    console.log("add event was silenced");
                }
            });

            return;
        }

        this.push(item_or_items);

        if (item_or_items['on']) {
            item_or_items.on(
                "change",
                this._on_model_change_event,
                {collection: this, item: item_or_items}
            );
        }

        if (!silent) {
            console.log("Triggering add event");
            this.trigger("add", item_or_items);
        } else {
            console.log("add event was silenced");
        }
    }

    remove(item_or_items, get_fn=default_get_fn) {
        /*
            Removes one of several elements from the collection.

            For each removed element fires `remove` event.
        */
        let that = this;

        if (Array.isArray(item_or_items)) { // if an array
            item_or_items.forEach((item) => {
                that._remove_one_item(item, get_fn);
            });

        } else { // item_or_items is not an array
            this._remove_one_item(item_or_items, get_fn);
        }
    }

    _remove_one_item(item, get_fn=default_get_fn) {
        let found_index;

        found_index = this.findIndex(
            (i) => { return get_fn(i) === get_fn(item); }
        );
        if (found_index >= 0) {
            if (this[found_index]['off']) {
                this[found_index].off('change');
            }
            this.splice(found_index, 1);
            this.trigger('remove', item);
        }
    }

    reset(item_or_items) {
        this.splice(0, this.length);

        if (is_non_empty_array(item_or_items)) {
            this.add(item_or_items);
        } else {
            // avoid triggering twice "change" event
            this.trigger("add");
        }
        this.trigger("reset");
    }

    get(attrs) {
        /**
         * Returns exactly one item of the collection that matches given
         * set of attributes.
         *
         * attrs - is expected to be a dictionary like object
         *
         * Returns a collection item when found and `undefined` if item was
         * not found.
         *
         * Examples:
         *
         *  // returns item that matches by title
         *  collection.get({title: "Invoice1.pdf"})
         *
         *  // returns item that matches by id
         *  collection.get({id: "101"})
         *
         * Note that passed attributes with value 'undefined' will be ignored
         * i.e. col.get({id: 1}) is same as col.get({id: 1, title: undefined})
         * because title attribute will be ignored (because its
         * value is undefined).
         */
        for(let i=0; i < this.length;  i++) {
            let found = true, matched_attr_count = 0;

            for(let key in attrs) {
                if (attrs[key] == undefined) {
                    continue;
                }
                if (attrs[key] != this[i][key]) {
                    found = false;
                } else {
                    matched_attr_count++;
                }
            }
            // there is at least one attribute which matched.
            if (found && matched_attr_count > 0) {
                return this[i];
            }
        }
        return undefined;
    }

    first() {
        /*
        Returns non-empty item in collection
        with lowerest index value.
        */
        let found;

        for(let i=0; i < this.length;  i++) {
            if (this[i]) {
                found = this[i];
                break;
            }
        }

        return found;
    }

    last() {
        /*
        Returns non-empty item in collection
        with highest index value.
        */
        let found;

        for(let i=this.length; i >= 0;  i--) {
            if (this[i]) {
                found = this[i];
                break;
            }
        }

        return found;
    }

    _on_model_change_event(item) {
        /* invoked every time when 'change' event
         is fired on collection's item.

        Caution! method has following context:

        `this.collection` is current collection
        `this.item` is the item on which change event was fired
        */

        this.collection.trigger("change", this.item);
    }
}

applyMixins(Collection, [Eventful]);

export { Collection };