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
      let newValue;

      console.log(event.target.value);

      switch (type) {
        case "float":
          newValue = parseFloat(event.target.value);
          break;
        case "bool":
          newValue = event.target.checked;
          break;
        case "radio":
          newValue = event.target.value;
          break;
      }

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
        this.elems[key].container.style.display = dependencies[key].includes(
          value
        )
          ? ""
          : "none";
      }
    }
  }
}

export { Model };
