import { assert } from "chai";

import {
    Path,
    UrlConf,
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
});

describe("test/test_urlconf.js:UrlConf", () => {

    it("basic urlconf usecase", () => {
        let urlpatterns = [
            new Path('folder/add/', 'folder_add'),
            new Path('folder/:folder_id/', 'folder')
        ], urlconf, prefix = '/test-prefix';

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