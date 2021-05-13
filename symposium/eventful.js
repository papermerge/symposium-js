import { ValueError } from "./exceptions";


const EV_ALL = 'all';

class Eventful {
    /*
    Eventful is a class that can be mixed in to any object, giving the object
    the ability to bind and trigger custom named events.

    For example:

    ```
        applyMixins(Model, [Eventful]);

        let model = new Model({attr: 0});

        model.on("incr", function() { this.attr += 1; });
        ...
        model.trigger("incr");
        model.trigger("incr");
        // model.attr is now 2
    ```

    You can give events any name you like.
    A special event named "all" will trigger all handlers.
    */

    on(name, callback, context) {
        /*
        Binds to the object event named `name`.
        When triggering the even will fire handler `callback`
        with given `context`.
        If `context` is not provided, `this` of the current object will
        be used.
        `callback` function will receive as arguments all objects passed
        as arguments to the trigger.
        For example:

        ```
            onchange(folder, parent_folder) {
                // folder is first arg passed by `trigger`
                // parent_folder is second arg passed by `trigger`
            }

            let fo = new Folder(),
                pa_fo = new Folder();

            model.on("change", onchange);

            model.trigger("change", fo, pa_fo);
        ```
        */
        if (!this._events) {
            this._events = {};
        }

        if (this._events[name] == undefined) {
            this._events[name] = [];
        };

        if (!context) {
            context = this;
        }

        if (Array.isArray(this._events[name])) {
            this._events[name].push({
                callback: callback,
                context: context,
            });
        }
    }

    trigger(name, ...args) {
        /*
        Trigger handers for event named `name`.

        Event handlers are invoked with `...args` arguments.
        A special event named "all" will trigger all handlers.
        */
        let handlers,
            callback,
            context,
            // special array of handlers
            // which will be fired for all events
            special_all_hdl;

        if (!name) {
            throw new ValueError("Expects non-empty name (str) as first arg");
        }

        if (typeof name != "string") {
            throw new ValueError("Expects non-empty name (str) as first arg");
        }

        if (!this._events) {
            this._events = {};
        }

        handlers = this._events[name];
        special_all_hdl = this._events[EV_ALL];

        if (!handlers) { // there are no other events handlers
            // add EV_ALL event handlers to the list
            handlers = this._events[EV_ALL];
        } else if (Array.isArray(special_all_hdl)) {
            // we have both:
            // usual event handlers and EV_ALL event handlers.
            // Here we merge them into a single array of
            // handlers.
            handlers = handlers.concat(special_all_hdl);
        }

        if (!Array.isArray(handlers)) {
            return;
        }
        // handlers is an Array
        handlers.forEach((handler) => {
            callback = handler.callback;
            context = handler.context;
            callback.apply(context, args);
        });
    }
}

export { Eventful, EV_ALL };