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

    hide() {
        this.el.style.display = 'none';
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