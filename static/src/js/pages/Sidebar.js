import { SidebarModel } from "./Sidebar.Model.js";
import cosmology from "../../config/cosmology.js";

class Sidebar {
  constructor(main) {
    const dom = (this.dom = document.createElement("div"));
    dom.id = "sidebar";

    const data = main.data;

    const selectModel = document.createElement("select");
    selectModel.classList.add("select");
    for (const model in cosmology) {
      const option = document.createElement("option");
      option.value = model;
      option.text = cosmology[model].longname;
      selectModel.appendChild(option);
    }

    dom.appendChild(selectModel);

    const addButton = document.createElement("button");
    addButton.id = "test";
    addButton.classList.add("add-model");
    addButton.innerText = "Add cosmology";

    dom.appendChild(addButton);

    const modelContainer = document.createElement("div");
    modelContainer.classList.add("model-container");
    dom.appendChild(modelContainer);

    // add sidebar model
    addButton.addEventListener("click", () => {
      const sidebarModel = new SidebarModel(data, selectModel.value);
      const params = sidebarModel.model.params;

      data.models.push(params);
      data.needsUpdate();

      modelContainer.appendChild(sidebarModel.dom);
    });

    // add one default model
    addButton.click();
  }
}

export { Sidebar };
