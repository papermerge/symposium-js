import $ from "jquery";

import { Eventful } from "../eventful";
import { NotImplemented, ValueError } from "../exceptions";
import {
    applyMixins,
    isFunction,
    isString,
    uniqueId
} from "../utils";


class View {

    get default_template_name() {
        throw new NotImplemented();
    }

    get default_template_engine() {
        throw new NotImplemented();
    }

    get default_context() {
        return {};
    }

    get template_name() {
        return  this.options['template_name'] || this.default_template_name;
    }

    get template_engine() {
        return this.options['template_engine'] || this.default_template_engine;
    }

    constructor(options={}) {
        this.options = options;
        this.cid = uniqueId('view');
        this.setElement(options['el']);
    }

    listenTo(obj, name, callback, ...default_args) {
        /* Listens to given object for events.

        When named events occur - trigger given callback with default arguments.
        Notice that default callback's arguments are used only if event trigger
        is called without callback arguments:

            Example 1: trigger called without callback arguments

                model.trigger("open")

            Example 2: trigger called with callback arguments:

                model.trigger("open", doc_dict, breadcrumb_path);

        `name` is either string name of one event e.g. "open" or
        it can be a string of comma separated events e.g. "reset, change".

        `callback` is the function which will be invoked when named event(s) occur.
        Notice that `callback` will always be called with same context as the current
        view (`view_instance.listenTo` -> callback will have context of `view_instance`).

        Examples:

            this.listenTo(this.collection, "change, reset", this.render);
            this.listenTo(this.model, "change", this.render);
        */
        let arr_of_names,
            that = this;

        if (!obj) {
            throw new ValueError("Expects a defined object");
        }
        if (!name) {
            throw new ValueError("Expects a defined name");
        }
        if (!callback) {
            throw new ValueError("Expects a defined callback");
        }
        arr_of_names = name.split(',');

        if (arr_of_names.length == 1) {
            // there were no commas in name
            obj.on(name, callback, this, default_args);
        } else {
            // multiple events provided
            // add event listener for each of them
            arr_of_names = arr_of_names.map(item => item.trim());
            arr_of_names.forEach(
                item => obj.on(item, callback, that, default_args)
            );
        }
    }

    delegateEvents() {
        let method,
            match,
            _method,
            events;

        if (this.events) {
            events = this.events;
        };

        if (!events) {
            return this;
        }

        if (isFunction(events)) {
            events = events();
        }

        this.undelegateEvents();

        for (let key in events) {
            method = events[key];
            if (!isFunction(method)) {
                _method = this[method];
            }
            if (!method) {
                continue;
            }
            match = key.match(/^(\S+)\s*(.*)$/);
            this.delegate(match[1], match[2], _method.bind(this));
        }
        return this;
    }

    delegate(eventName, selector, listener) {
        if (!this.$el) {
            return;
        }
        this.$el.on(
            eventName + '.delegateEvents' + this.cid,
            selector,
            listener
        );
        return this;
    }

    undelegateEvents() {
        if (!this.$el) {
            return;
        }
        if (this.$el) {
            this.$el.off('.delegateEvents' + this.cid);
        }
        return this;
    }

    setElement(element) {
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this;
    }

    _setElement(element) {
        /*
        element passed here can be one of following
            * string
            * HTMLElement
            * HTMLDocument
        */
        let msg;

        if (element === undefined) {
            // this is absolutely OK.
            // Many times element is set as part of setElement(options['el'])
            // where options does not have `el` key i.e. options['el'] === undefined
            return;
        }
        if (element === null) {
            // document.querySelector("some value") returns null if
            // query did not match any element.
            msg = 'Element is null, possibly result of empty query selector.'
            console.warn(msg)
        }
        // ok, now element is defined and non-null
        if (element instanceof HTMLElement || element instanceof HTMLDocument){
            this.$el = $(element);
            this.el = element;
        } else if (isString(element)){
            this.$el = $(element);
            this.el = document.querySelector(element);
        }
    }

    show() {
        this.el.style.display = 'block';
    }

    is_visible() {
        return this.el.style.display == 'block';
    }

    hide() {
        this.el.style.display = 'none';
    }

    is_hidden() {
        return this.el.style.display == 'none';
    }

    render_to_string() {
        let html;

        html = this.template_engine.render(
            this.template_name,
            this.default_context
        );

        return html;
    }

    render() {
        let html = this.render_to_string();

        if (this.el) {
            this.el.innerHTML = html;
        }

        return html;
    }
}

applyMixins(View, [Eventful]);

export { View };