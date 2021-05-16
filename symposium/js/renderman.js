import { renderString } from "nunjucks";
import { TemplateNotFound, ValueError } from "./exceptions";


class Renderman {

    constructor(templates_map) {
        this.templates_map = templates_map;
    }

    render(template_name, context={}) {
        let templ;

        templ = this.get_template(template_name);

        return renderString(templ, context);
    }

    get_template(template_name) {

        let template = undefined,
            new_template_name;

        if (!template_name) {
            throw new ValueError("Empty argument");
        }

        // user asks for template with prefix e.g. "templates/document.html"
        if (template_name.startsWith('templates/')) {
            // strip prefix
            new_template_name = template_name.replace(/^templates\//, '')
            template = this.templates_map.get(new_template_name);
        } else { // user asks for template without prefix e.g. "document.html"
            template = this.templates_map.get(template_name);
        }

        if (!template) {
            throw new TemplateNotFound(
                `Template ${template_name} not found`
            );
        }

        return template;
    }
}


export { Renderman };