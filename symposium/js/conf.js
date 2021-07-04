let settings = new Map();

settings.set("csrf-header", "X-CSRFToken");
// a DOM selector to retrieve csrf middleware token
settings.set("csrf-selector", "[name=csrfmiddlewaretoken]");

export { settings };