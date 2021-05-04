
class Eventful {

    on(name, callback, context) {

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
        let handlers,
            callback,
            context;

        if (!this._events) {
            this._events = {};
        }

        handlers = this._events[name];
        if (Array.isArray(handlers)) {
            for (let i=0; i < handlers.length; i++) {
                callback = handlers[i].callback;
                context = handlers[i].context;
                callback.apply(context, args);
            }
        } 
    }
}

export { Eventful };