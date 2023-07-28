import cosmology from "../../config/cosmology.js";
import cosmologyFormat from "../../config/cosmologyParams.js";
import { Input } from "./Input.js";

class Model {
  constructor(type, data) {
    this.cosmo = cosmology[type];
    this.type = type;
    this.data = data;

    this.params = {};
    this.elems = {};

    for (const option in cosmologyFormat) {
      this.createOption(option, cosmologyFormat[option]);
    }

    for (const elem in this.elems)
      this.updateParams(elem, this.params[elem], this.elems[elem].dependencies);
  }

  createOption(name, format) {
    const type = format.type;
    const dependencies = format.dependencies;

    const onChange = (event) => {
      let newValue =
        type == "bool" ? event.target.checked : parseFloat(event.target.value);

      if (newValue !== this.params[name]) {
        this.updateParams(name, newValue, dependencies);
        this.data.needsUpdate();
      }
    };

    const defaultValue = this.cosmo[name];
    const formattedValue =
      format.value !== undefined ? structuredClone(format.value) : {};
    if (defaultValue !== undefined) formattedValue.default = defaultValue;

    const container = new Input(
      cosmologyFormat[name].text,
      type,
      formattedValue,
      cosmologyFormat[name].def,
      onChange
    ).dom;

    this.params[name] = formattedValue.default;

    this.elems[name] = {
      container,
      dependencies,
    };
  }

  updateParams(name, value, dependencies) {
    this.params[name] = value;

    if (dependencies != undefined) {
      for (const key in dependencies) {
        this.elems[key].container.style.display =
          dependencies[key] == value ? "" : "none";
      }
    }
  }
}

export { Model };
