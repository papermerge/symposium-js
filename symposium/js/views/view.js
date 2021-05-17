import $ from "jquery";

import { Eventful } from "../eventful";
import { NotImplemented } from "../exceptions";
import { applyMixins, isFunction, uniqueId } from "../utils";


class View {

    get default_template_name() {
        throw new NotImplemented();
    }

    get default_template_engine() {
        throw new NotImplemented();
    }

    render_to_string() {
        throw new NotImplemented();
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
        this.$el.on(
            eventName + '.delegateEvents' + this.cid,
            selector,
            listener
        );
        return this;
    }

    undelegateEvents() {
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

    _setElement(el) {
        if (el instanceof $) {
            this.$el = el;
        } else {
            this.$el = $(el);
        }
        this.el = this.$el[0];
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