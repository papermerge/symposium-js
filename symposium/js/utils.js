
function applyMixins(model, arr_mixins) {

    arr_mixins.forEach((mixin) => {
      Object.getOwnPropertyNames(mixin.prototype).forEach((name) => {
        let value;

        value = Object.getOwnPropertyDescriptor(mixin.prototype, name);
        value = value || Object.create(null);

        Object.defineProperty(model.prototype, name, value);
      });
    });
}

let idCounter = 0;
function uniqueId(prefix) {
  let id = ++idCounter + '';
  return prefix ? prefix + id : id;
}

function isFunction(func) {
  if (func && typeof func === "function") {
    return true
  }
  return false
}

function is_non_empty_array(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

export {
  applyMixins,
  uniqueId,
  isFunction,
  is_non_empty_array
};