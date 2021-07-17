import { View } from "./view";
import { EV_CTX_MENU_ITEM_CLICK } from "../events";
import { CtxMenu } from "../models/ctx_menu";


class CtxMenuBaseView extends View {

    constructor({
        collection=new CtxMenu(),
        options={}
    }) {
        super(options);
        let that = this;

        this.collection = collection;
        this.options = options;
        this.el_menu = options['el_menu'];

        document.addEventListener('click', function(event) {
            // any user click will close context menu
            that._dropdown_close();
        });
    }

    events() {
        // DOM events
        let event_map = {
            "click li.dropdown-item > a": "on_item_clicked",
            "contextmenu": "context_menu_trigger",
        }
        return event_map;
    }

    on_item_clicked(event) {
        let target = event.currentTarget,
        item_id,
        parent,
        item;

        event.preventDefault();
        // target is <a> element
        // target.parentNode is <li> element
        parent = target.parentNode
        if (!parent) {
            console.error("CtxMenu unable to retrieve id of clicked element.");
            return;
        }
        item_id = parent.id;

        if (!this.collection) {
            return;
        }

        item = this.collection.get({id: item_id});

        if (!item) {
            console.error("Context menu item not found.");
            return;
        }

        this.trigger(EV_CTX_MENU_ITEM_CLICK, item);
        this._dropdown_toggle();
    }

    context_menu_trigger(event) {
        let dropdown_menu;

        event.preventDefault();

        if (this.el_menu) {
            this._dropdown_toggle();
            this.el_menu.style.top = `${event.pageY}px`;
            this.el_menu.style.left = `${event.pageX}px`;
        }
    }

    render_to_string() {

        let html, context = {};

        context['items'] = this.collection;
        html = this.template_engine.render(
            this.template_name,
            context
        )

        return html;
    }

    render() {
        let html = this.render_to_string();

        if (this.el_menu) {
            this.el_menu.innerHTML = html;
        }

        return html;
    }

    _dropdown_close() {
        let dropdown_menu;

        if (this.el_menu) {
            dropdown_menu = this.el_menu.querySelector('.dropdown-menu');
            if (dropdown_menu) {
                dropdown_menu.classList.remove('show');
            } else {
                console.error(".dropdown-menu not found");
            }
        } else {
            console.error("el_menu is undefined");
        }
    }

    _dropdown_toggle() {
        let dropdown_menu;

        if (this.el_menu) {
            dropdown_menu = this.el_menu.querySelector('.dropdown-menu');
            if (dropdown_menu) {
                dropdown_menu.classList.toggle('show');
            } else {
                console.error(".dropdown-menu not found");
            }
        } else {
            console.error("el_menu is undefined");
        }
    }
};

export { CtxMenuBaseView };