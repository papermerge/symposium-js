import {
    UrlPathNotFound,
    UnresolvedURLParams,
    ValueError
} from "./exceptions";
import { Collection } from "./collection";


function path(url_pattern, name) {
    // a convinient shortcut fo new Path(...)
    return new Path(url_pattern, name);
}


function replace_mandatory_params(url_pattern, obj) {
    let ret;

    ret = url_pattern.replace(/:\w+/g,
        function(match) {
            let named_param;

            // mandatory params starts with ":"
            named_param = match.substring(1);
            if (!obj[named_param]) {
                throw new UnresolvedURLParams(
                    `Unresolved named param '${named_param}'`
                );
            }
            return obj[named_param];
        }
    ); // end of replace method

    return ret;
}


function replace_optional_params(url_pattern, obj) {
    let ret;

    ret = url_pattern.replace(/(\(\:[\w\/]+\))/g,
        function(match) {
            let named_param;
            named_param = match.substring(2);
            named_param = named_param.replace(/\/\)/g, '');
            if (!obj || !obj[named_param]) {
                return '';
            }
            // HACK
            if (match.search(/\//) >= 0) {
                return `${obj[named_param]}/`;
            }
            return obj[named_param];
        }
    ); // end of replace method

    return ret;
} // _replace_optional_params


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

        However:

            path.url() => will throw exception "UnresolvedURLPattern".

        To fix it:

            path.url({document_id: 34}) => "document/34/"

        Path also supports optinal params:

            path = new Path("folder/(:folder_id/)", "folder")

        In this case `folder_id` may or may not be provided:

            path.url() => It is OK and produces "folder/"
            path.url({folder_id: 202}) => "folder/202/"
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
        let url_step_1,
            url_step_2;

        if (!obj) {
            if (this._url_pattern.search(/[^\(]:\w+/g) >= 0) {
               // url contains MANDATORY named params, however no `obj` was provided
               // mandatory named params DO NOT START with open bracket
               throw new UnresolvedURLParams("Unresolved params found");
            }
        }

        url_step_1 = replace_optional_params(
            this._url_pattern,
            obj
        );

        url_step_2 = replace_mandatory_params(
            url_step_1,
            obj
        );

        return url_step_2;
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
        ret_url = `/${this.prefix}/${found_url}`;

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


class UrlConfs extends Collection {
    /*
        A collection of urlconf instances.

        Each urlconf instance has its own prefix.
    */
    constructor({default_prefix}) {
        super();
        this.default_prefix = default_prefix;
    }

    url(path_name, obj) {
        /*
            An `url` method which understands prefixes.

            Example:
                url('ws:document') will proxy to urlconf instance with 'ws' prefix.
                url('document') will proxy to urlconf instance with `default_prefix`
        */
        let arr,
            prefix,
            path,
            urlconf;

        if (!path_name) {
            throw new ValueError('Empty path_name');
        }

        arr = path_name.split(':');

        if (arr && arr.length == 2) {
            prefix = arr[0];
            path = arr[1];
        } else if (arr) {
            prefix = this.default_prefix;
            path = arr[0];
        }

        urlconf = this.get({prefix});

        if (!urlconf) {
            throw new UrlPathNotFound(`Path '${path_name}' not found`);
        }
        // proxy to urlconf with correct prefix
        return urlconf.url(path, obj);
    }

    get prefix() {
        return this.default_prefix;
    }

    set prefix(value) {
        this.default_prefix = value;
    }

    root_url() {
        let urlconf = this.get({prefix: this.default_prefix});

        if (!urlconf) {
            throw new UrlPathNotFound(`Path '${path_name}' not found`);
        }

        return urlconf.root_url();
    }
}


export {
    UrlConf,
    UrlConfs,
    path,
    Path,
    replace_optional_params,
    replace_mandatory_params
};