import { Collection } from "../collection";

import { EV_PANEL_ITEM_SELECTED } from "../events";


class CtxMenu extends Collection {

    constructor() {
        super();
        this.on(
            EV_PANEL_ITEM_SELECTED,
            this.on_item_panel_selected,
            this
        );
    }

    on_item_panel_selected({item, selection}) {
        this.forEach((i) => {
                i.enabled = i.condition({selection});
            }
        );
        this.trigger("change");
    }
}

export { CtxMenu };