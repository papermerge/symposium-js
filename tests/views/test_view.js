import { assert } from "chai";

import { ValueError } from "../../symposium/js/exceptions";
import { View } from '../../symposium/js/views/view';
import { Model } from '../../symposium/js/model';


class SomeModel extends Model {

}


class TemplateEngine {
  render(whatever) {
    return `<div>${whatever.value}</div>`;
  }
}

const template_engine = new TemplateEngine();


class SomeView extends View {

  get default_template_engine() {
    /*
    Yes, this references a global instance
    It is up to the application to provide
    template engine instance.
    */
    return template_engine;
  }

  render_to_string(whatever) {
    let _template_engine;

    _template_engine = this.template_engine;

    return _template_engine.render(whatever);
  }
}


describe("test/views/view_test.js", () => {

    it("can be instanciated", () => {
        // can be instanciated without arguments
        let view  = new View();

        assert.isDefined(view);
    }); // it can be rendered

    it("can be rendered", () => {
        // Provided `default_template_engine` and `render_to_string`
        // view can be rendered
        let view  = new SomeView(),
            rendered_view,
            context;

        context = {
            value: "Hi!"
        }

        rendered_view = view.render_to_string(context);
        assert.equal(
            rendered_view,
            "<div>Hi!</div>",
            "View rendering yielded expected string!"
        );
    }); // it can be rendere

    it("can listen to a model -change- events", () => {
        let view = new View(),
            count = 0,
            model = new SomeModel();

        view.listenTo(model, "change", () => { count++; });

        model.trigger("change");
        model.trigger("change");
        model.trigger("change");

        assert.equal(
            count,
            3,
            "Model changed 3 times, but count variable didnt :("
        );
    });

    it("will complain if listenTo receives undefined model", () => {
        let view = new View(),
            count = 0;

        assert.throws(
            () => {
                view.listenTo(undefined, "change", () => { count++ });
            },
            ValueError, // exception to be thrown
            /Expects/i, // message of the exeption
            "listenTo didnt complain about undefined model"
        );
    });

    it("can listenTo multiple events separated by comma", () => {
        let view = new View(),
            model = new SomeModel(),
            count = 0;

        view.listenTo(model, "event_x, event_y", () => { count++ });

        model.trigger("event_x");
        model.trigger("event_y");

        assert.equal(
            count,
            2,
            "count should have been incremented twice"
        );

        model.trigger("event_z");
        assert.equal(
            count,
            2,
            "count should have been stayed same"
        );
    });
});