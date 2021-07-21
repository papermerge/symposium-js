

class Request {

    constructor() {
        this._url = undefined;
        this._headers = {};
        this._options = {
            'headers': this.headers
        };
        this._data = undefined;
    }

    get url() {
        return this._url;
    }

    get() {
        return fetch(this.url, this.options);
    }

    post() {
        let _headers,
            csrf_token,
            csrf_header;

        this.options['method'] = 'POST';
        this.options['body'] = this.body;

        // headers updated with csrf token value
        _headers = this.headers;
        csrf_token = this._csrf_token_value();
        if (csrf_token) {
            csrf_header = this.default_settings.get('csrf-header');
            _headers[csrf_header] = csrf_token;
            this.options['headers'] = _headers;
        }

        return fetch(this.url, this.options);
    }

    delete() {
        let _headers,
            csrf_token,
            csrf_header;

        this.options['method'] = 'DELETE';
        this.options['body'] = this.data;

        _headers = this.headers;
        // headers updated with csrf token value
        csrf_token = this._csrf_token_value();
        if (csrf_token) {
            csrf_header = this.default_settings.get('csrf-header');
            _headers[csrf_header] = csrf_token;
            this.options['headers'] = _headers;
        }

        return fetch(this.url, this.options);
    }

    get headers() {
        return this._headers;
    }

    set header(value) {
        this._headers = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    get body() {
        return this.data;
    }

    get data() {
        return this._data;
    }

    _csrf_token_value() {
        let csrf_selector,
            token;

        csrf_selector = this.default_settings.get('csrf-selector');

        if (csrf_selector) {
            token = document.querySelector(csrf_selector);
            if (!token) {
                console.warn("CSRF token DOM element not found");
            } else {
               return token.value;
            }
        } else {
            console.warn("CSRF selector not found");
        }
    }

    get default_settings() {
        return {};
    }
}


class JsonRequest extends Request {
    constructor() {
        super();
        this._headers['Content-Type'] = 'application/json';
    }

    get() {
        let promise;

        promise = super.get();

        return this._json(promise);
    }

    post() {
        let promise;

        promise = super.post();

        return this._json(promise);
    }

    delete() {
        let promise;

        promise = super.delete();

        return this._json(promise);
    }

    _json(promise) {
        let ret;

        ret = promise.then((response) => {
            if (response.status != 200) {
                throw new Error(response.statusText);
            }
            // response.json() returns a Promise!
            return response.json();
        });

        return ret;
    }

    get body() {
        return JSON.stringify(this.data);
    }
}

export {
    Request,
    JsonRequest
}