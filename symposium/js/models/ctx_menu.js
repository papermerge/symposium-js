import { Collection } from "../collection";

//import { EV_NODE_SELECTED } from "../events";


class CtxMenu extends Collection {

    constructor() {
        super();
  //      this.on(EV_NODE_SELECTED, this.on_node_selected, this);
    }

    on_node_selected({node, selection}) {
        this.items.forEach((item) => {
                item.enabled = item.condition({selection});
            }
        );
        this.trigger("change");
    }
}

export { CtxMenu };