class CtxMenuItem {
    /*
    CtxMenuItem is an item in some sort of menu.
    It can be an item in context menu (e.g. models.ctx_menu.CtxMenu)
    or an item in some sort of panel similar functionality like
    context menu.
    */

    constructor({
        id,
        title,
        icon_class,
        condition,
        enabled=true,
        run
    }){
        this.id = id;
        this.title = title;
        this.icon_class = icon_class;
        /* a callable, which returns true or false
        `condition` callable will be invoked with
        {selection, parent} argument.
        */
        this.condition = condition;
        // is this item enabled?
        this.enabled = enabled;
        /* a callable invoked with
        {selection, parent} arguments
        */
        this.run = run;
    }
}

export { CtxMenuItem };