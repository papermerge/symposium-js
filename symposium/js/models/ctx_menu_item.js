class CtxMenuItem {
    /*
    CtxMenuItem is an item in some sort of menu.
    It can be an item in context menu (e.g. models.ctx_menu.CtxMenu)
    or an item in some sort of panel similar functionality like
    context menu.

    `this.parent_view` attribute is instance to view inside which
    context menu was declared. For example in case of commander instance's ctx menu,
    the `parent_view` is instance of commander itself (i.e. commander view).
    */

    constructor({
        parent_view,
        id,
        title,
        icon_class,
        condition,
        enabled=true,
        run
    }){
        // references to the parental view (e.g. commander's view instance)
        this.parent_view = parent_view;
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