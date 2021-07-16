import { View } from "../view";

import {
    EV_PANEL_ITEM_SELECTED,
    EV_PANEL_ITEM_CLICK,
    EV_PANEL_ITEM_DBLCLICK
} from "../../events";


const CLICK_TIMEOUT = 250; // miliseconds


class PanelBaseView extends View {

    get default_options() {
        return {
            'loader_selector': '.loader',
            'el': undefined
        }
    }

    constructor({
        collection,
        options={}
    }) {
        super(options);
        this.collection = collection;
    }

    events() {
        // DOM events
        let event_map = {
            "click .item > input[type=checkbox]": "on_item_selected",
            "click .item": "on_item_clicked",
            "dblclick .item": "on_item_dblclick"
        }
        return event_map;
    }

    on_item_selected(event) {
        let current_target = event.currentTarget,
            item_id,
            item,
            parent,
            current_selection;

        console.log("on_item_selected");
        // parent is DOM element with .node class,
        // which among others contains the checkbox
        parent = current_target.parentNode;
        if (!parent) {
            console.error(`No parent defined for target ${current_target}`);
            return;
        }

        item_id = parent.dataset.id;
        if (!this.collection) {
            return;
        }
        item = this.collection.get({id: item_id});

        if (!item) {
            console.error(`Item not found for target ${current_target}`);
            return;
        }

        item.toggle_selection();

        current_selection = this.collection.filter(
            (item) => { return item.is_selected; }
        );

        this.trigger(
            EV_PANEL_ITEM_SELECTED,
            {
                item:item,
                selection:current_selection
            }
        );
    }

    on_item_clicked(event) {
        let target = event.currentTarget,
            item_id,
            item,
            that = this;

        if (event.target.type == "checkbox") {
            // user clicked item's checkbox, which is not the concern
            // of current event handler. Instead `on_item_selected`
            // handler will should process this event.
            return;
        }

        event.preventDefault();
        // vanilla js equivalent of $(...).data('id');
        item_id = target.dataset.id;
        if (!this.collection) {
            return;
        }
        item = this.collection.get({id: item_id});

        // single click or dblclick?
        if (this.timer) {
            // This way, if click is already set to fire,
            // it will clear itself to avoid duplicate 'Single' alerts.
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(
            function() {
                that.trigger(
                    EV_PANEL_ITEM_CLICK,
                    item
                );
            },
            CLICK_TIMEOUT
        );
    }

    on_item_dblclick(event) {
        let target = event.currentTarget,
            item_id,
            item;

        event.preventDefault();
        // vanilla js equivalent of $(...).data('id');
        item_id = target.dataset.id;
        if (!this.collection) {
            return;
        }
        item = this.collection.get({id: item_id});

        if (this.timer) {
            clearTimeout(this.timer);
        }
        console.log(`triggering dblclick for ${item}`);
        this.trigger(
            EV_PANEL_ITEM_DBLCLICK,
            item
        );
    }

    show_loader() {
        let selector, loader;

        selector = this.options['loader_selector'];
        if (selector) {
            loader = document.querySelector(selector);

            if (loader) {
                loader.style.visibility = 'visible';
            }
        }
    }

    hide_loader() {
        let selector, loader;

        selector = this.options['loader_selector'];
        if (selector) {
            loader = document.querySelector(selector);

            if (loader) {
                loader.style.visibility = 'hidden';
            }
        }
    }

    render_to_string() {

        let html_panel = "",
            context = {};

        if (!this.collection) {
            return html_panel;
        }
        context['objects'] = this.collection;
        html_panel = this.template_engine.render(
            this.template_name,
            context
        );

        return html_panel;
    }

    render() {
        let panel_html = this.render_to_string();

        if (this.el) {
            this.el.innerHTML = panel_html;
        }
        return panel_html;
    }
};


export { PanelBaseView };
