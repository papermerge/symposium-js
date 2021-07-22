import { assert } from "chai";

import {
    Path,
    UrlConf,
    replace_optional_params,
    replace_mandatory_params
} from '../symposium/js/urlconf';

import { UnresolvedURLParams } from "../symposium/js/exceptions";


describe("test/test_urlconf.js:Path", () => {

    it("tests Path very basic test", () => {
        // very basic usecase
        let path;

        path = new Path("document/add/", "document_add");

        assert.isDefined(path);

        assert.equal(
            path.name,
            "document_add",
            "Path name must be 'document_add'"
        );
        assert.equal(
            path.url(),
            "document/add/",
            "Path url must be 'document/add/'"
        );
    }); // test isFunction

    it("accepts one named params", () => {
        // usecase with one named param
        let path;

        path = new Path("document/:document_id/", "document");

        assert.equal(
            "document/36/",
            path.url({document_id: 36}),
            "Returned url expected to be document/36/"
        );
    });

    it("accepts more named params", () => {
        // usecase with two named params
        let path;

        path = new Path(
            "document/:document_id/page/:page_id/",  // url pattern
            "page"  // url name
        );

        assert.equal(
            "document/36/page/100/",
            path.url({document_id: 36, page_id: 100}),
            "Returned url expected to be document/36/page/100/"
        );
    });

    it("handles optional params", () => {
        // optional params are speficied between
        // brackets
        let path;

        path = new Path(
            "folder/(:folder_id/)",  // :folder_id is optional
            "folder"  // url name
        );

        assert.equal(
            "folder/36/",
            path.url({folder_id: 36}),
            "Filling in optional param didnt work"
        );

        assert.equal(
            "folder/",
            path.url(), // no params is OK, as :folder_id is optional
            "Passing empty args didnt work"
        );
    });

});

describe("test/test_urlconf.js:UrlConf", () => {

    it("basic urlconf usecase", () => {
        let urlpatterns = [
            new Path('folder/add/', 'folder_add'),
            new Path('folder/:folder_id/', 'folder')
        ], urlconf, prefix = 'test-prefix';

        urlconf = new UrlConf({prefix, urlpatterns});

        assert.isDefined(urlconf);

        assert.equal(
            "/test-prefix/folder/add/",
            urlconf.url("folder_add"),
            "Named path 'folder_add' must return 'folder/add/' url"
        );

        assert.equal(
            "/test-prefix/folder/100/",
            urlconf.url("folder", {folder_id: 100}),
            "Wrong result for named path `folder`"
        );
    });

    it("throws exception when not enough params are supplied", () => {
        let urlpatterns = [
            new Path('folder/add/', 'folder_add'),
            new Path('folder/:folder_id/', 'folder')
        ], urlconf, prefix = '/test-prefix';

        urlconf = new UrlConf({prefix, urlpatterns});

        assert.throws(
            () => { urlconf.url("folder", {});  /* empty object passed */ },
            UnresolvedURLParams, // exception to be thrown
            /Unresolved/i // message of the exeption
        );
        // same as above, but here no object is passed at all
        assert.throws(
            () => { urlconf.url("folder"); /* no object passed */ },
          UnresolvedURLParams, // exception to be thrown
          /Unresolved/i // message of the exeption
        );
    });
});


describe("test/test_urlconf.js:replace_optional_params", () => {
    it("replace_optional_params", () => {
        assert.equal(
            replace_optional_params("folder/(:folder_id/)", {}),
            "folder/",
            "Assertion #1"
        );
        assert.equal(
            replace_optional_params("folder/(:folder_id/)", {folder_id: 202}),
            "folder/202/",
            "Assertion #2"
        );
        assert.equal(
            replace_optional_params("folder/(:folder_id/)"),
            "folder/",
            "Assertion #3"
        );
    });
});

describe("test/test_urlconf.js:replace_mandatory_params", () => {
    it("replace_mandatory_params", () => {
        assert.equal(
            replace_mandatory_params("folder/:folder_id/", {folder_id: 99}),
            "folder/99/",
            "Assertion #1"
        );
    });
});