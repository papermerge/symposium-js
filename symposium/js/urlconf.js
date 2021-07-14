import {
    UrlPathNotFound,
    UnresolvedURLParams,
    ValueError
} from "./exceptions";


function path(url_pattern, name) {
    // a convinient shortcut fo new Path(...)
    return new Path(url_pattern, name);
}


class Path {
    /*
        Path is named URL pattern.

        For example:

            path = new Path("document/add/", "document_add");
            path.url() => "document/add/"
            path.name =>  "document_add"

        Slightly more complex example:

            path = new Path("document/:document_id/", "document");
            path.name => "document"

            however:

            path.url() => will throw exception "UnresolvedURLPattern".

            To fix it:

            path.url({document_id: 34}) => "document/34/"
    */
    constructor(url_pattern, name) {
        this._url_pattern = url_pattern;
        this._name = name;
    }

    url(obj) {
        /*
        Resolves URL pattern to a string using given object.
        If object is `undefined`, then this._url must be string without named parameter, otherwise
        throws `UnresolvedURLParamers` exception.
        Each named parameter will be replaced with object's attribute of same name.
        Example:

        path = new Path("/document/:document_id/page/:page_id/", "page");
        path.url({page_id: 34, document_id: 100}) => "/document/100/page/34/";
        */
        let result_url;
        const named_param_regexp = new RegExp(/:\w+/g);

        if (!obj) {
            if (this._url_pattern.search(named_param_regexp) >= 0) {
               // url contains named params, however no `obj` was provided
               throw new UnresolvedURLParams("Unresolved params found");
            }
            // object not provided, but it is ok, as we don't have named params
            return this._url_pattern;
        }

        result_url = this._url_pattern.replace(named_param_regexp,
            function(match) {
                let named_param;

                named_param = match.substring(1);
                if (!obj[named_param]) {
                    throw new UnresolvedURLParams(
                        `Unresolved named param '${named_param}'`
                    );
                }
                return obj[named_param];
            }
        );

        return result_url;
    }

    get name() {
        return this._name;
    }
}

class UrlConf {

    constructor({prefix, urlpatterns}) {
        this._prefix = prefix;
        this._urlpatterns = urlpatterns;
    }

    url(path_name, obj) {
        /* returns (prefixed) URL as string from path_name and object */
        let found_path, found_url, ret_url;

        found_path = this._urlpatterns.find(
            path => { return path.name == path_name }
        );

        if (!found_path) {
            throw new UrlPathNotFound(`Path '${path_name}' not found`);
        }

        found_url = found_path.url(obj);
        ret_url = `${this.prefix}/${found_url}`;

        return ret_url;
    }

    root_url() {
        return this.prefix;
    }

    get prefix() {
        return this._prefix;
    }

    set prefix(value) {
        this._prefix = value;
    }
}


export { UrlConf, path, Path };