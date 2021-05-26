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
            this._events = new Map();
        }

        if (!this._events.has(name)) {
            this._events.set(name, []);
        };

        if (!context) {
            context = this;
        }

        if (Array.isArray(this._events.get(name))) {
            this._events.get(name).push({
                callback: callback,
                context: context,
            });
        }
    }

    off(name) {
        /*
        Removes bound listeners for event `name`.

        If `name` is empty - removes all event listeners.
        */
        if(!name) {
            if (this._events) {
                this._events.clear();
            } else {
                console.warn(`-off- called before -on-; name=-${name}-`);
            }
            return;
        }

        if (this._events) {
            this._events.delete(name);
        } else {
            console.warn(`-off- called before -on-; name=-${name}-`);
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
            throw new ValueError("Expects non-empty name as first arg");
        }

        if (typeof name != "string") {
            throw new ValueError("Expects name (str) as first arg");
        }

        if (!this._events) {
            this._events = new Map();
        }

        handlers = this._events.get(name);
        special_all_hdl = this._events.get(EV_ALL);

        if (!handlers) { // there are no other events handlers
            // add EV_ALL event handlers to the list
            handlers = this._events.get(EV_ALL);
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