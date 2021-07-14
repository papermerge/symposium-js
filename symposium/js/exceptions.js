class Exception extends Error {

    constructor(message="Not yet implemented") {
        super(message);
        this.message = message;
        this.name = "Exception";
    }
}

class TemplateNotFound extends Exception {
    constructor(message) {
        super(message);
        this.name = 'TemplateNotFound';
    }
}


class NotImplemented extends Exception {

    constructor(message) {
        super(message);
        this.name = "NotImplemented";
    }
}


class ValueError extends Exception {

    constructor(message) {
        super(message);
        this.name = 'ValueError';
    }
}


class UrlPathNotFound extends Exception {
    /* Used in Urlconf if path was not found */
    constructor(message) {
        super(message);
        this.name = 'UrlPathNotFound';
    }
}

class UnresolvedURLParams extends Exception {
    constructor(message) {
        super(message);
        this.name = 'UnresolvedURLParams';
    }
}

export {
    TemplateNotFound,
    ValueError,
    NotImplemented,
    UrlPathNotFound,
    UnresolvedURLParams
};