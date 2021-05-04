import { Eventful } from "./eventful";
import { applyMixins } from "./utils";

class Model {
}

applyMixins(Model, [Eventful]);

export { Model };