import { Model } from "../components/Model.js";
import { Tooltip } from "../components/Tooltip.js";
import cosmology from "../../config/cosmology.js";
import cosmologyParams from "../../config/cosmologyParams.js";

class SidebarModel {
  constructor(data, type) {
    this.data = data;
    this.model = new Model(type, data);
    this.dom = this.createDom();
  }

  createDom() {
    const dom = document.createElement("div");
    dom.classList.add("sidebar-model");

    const options = document.createElement("div");
    options.classList.add("sidebar-options");

    options.appendChild(this.createBody());

    const advancedBody = this.createAdvancedBody();
    const advancedToggle = this.createAdvancedToggle(advancedBody);
    options.appendChild(advancedToggle);
    advancedToggle.appendChild(advancedBody);

    const header = this.createHeader(options);
    dom.appendChild(header);
    dom.appendChild(options);

    return dom;
  }

  createHeader(options) {
    const header = document.createElement("div");
    header.classList.add("sidebar-header");
    const expandToggle = this.createExpandToggle(header);
    header.appendChild(expandToggle);
    const headerTitle = this.createHeaderTitle();
    header.appendChild(headerTitle);
    const enabledToggle = this.createEnabledToggle();
    header.appendChild(enabledToggle);

    header.addEventListener("click", (e) => {
      if (e.target == header || e.target.classList.contains("expand-toggle")) {
        if (options.style.display === "none") {
          options.style.display = "";
          delete expandToggle.dataset.collapse;
        } else {
          options.style.display = "none";
          expandToggle.dataset.collapse = true;
        }
      }
    });

    const trash = this.createTrash();
    header.appendChild(trash);
    return header;
  }

  createExpandToggle(header) {
    const expandToggle = document.createElement("div");
    expandToggle.classList.add("expand-toggle", "icon-button");
    const expandTooltip = new Tooltip(expandToggle, "Expand model");
    return expandToggle;
  }

  createHeaderTitle() {
    const headerTitle = document.createElement("input");
    headerTitle.value = this.addName(cosmology[this.model.type].shortname);
    headerTitle.classList.add("model-name");
    headerTitle.addEventListener("input", this.resizeTitle);
    headerTitle.addEventListener("change", (e) => {
      if (e.target.value == "") e.target.value = this.addName("Model");
      else e.target.value = this.addName(e.target.value, headerTitle);
      this.resizeTitle.call(headerTitle);
      this.data.needsUpdate();
    });
    this.resizeTitle.call(headerTitle);
    return headerTitle;
  }

  createEnabledToggle() {
    const enabledToggle = document.createElement("div");
    this.enabledToggle = enabledToggle;
    enabledToggle.classList.add("checkbox", "enable-toggle");
    enabledToggle.dataset.checked = "";

    enabledToggle.addEventListener("click", () => {
      if ("checked" in enabledToggle.dataset) {
        delete enabledToggle.dataset.checked;
        this.data.disabled.push(this.model.params);
      } else {
        enabledToggle.dataset.checked = "";
        this.data.disabled.splice(
          this.data.disabled.indexOf(this.model.params),
          1
        );
      }
      this.data.needsUpdate();
    });
    const enabledTooltip = new Tooltip(enabledToggle, "Show/hide in output");

    return enabledToggle;
  }

  createTrash() {
    const trash = document.createElement("button");
    trash.classList.add("trash", "icon-button");
    const trashTooltip = new Tooltip(trash, "Delete model");

    trash.addEventListener("click", () => {
      this.data.models.splice(this.data.models.indexOf(this.model.params), 1);
      if (this.data.disabled.indexOf(this.model.params) !== -1)
        this.data.disabled.splice(
          this.data.disabled.indexOf(this.model.params),
          1
        );
      this.data.needsUpdate();
      this.dom.remove();
    });
    return trash;
  }

  createBody() {
    const body = document.createElement("div");
    body.classList.add("sidebar-body");
    for (const elem in this.model.elems) {
      if (cosmologyParams[elem].advanced === true) continue;

      body.appendChild(this.model.elems[elem].container);
    }
    return body;
  }

  createAdvancedToggle(advancedBody) {
    const advancedToggle = document.createElement("div");
    advancedToggle.classList.add("advanced-toggle", "input-container");

    const title = document.createElement("div");
    title.classList.add("advanced-title");
    advancedToggle.appendChild(title);

    const icon = document.createElement("div");
    icon.classList.add("expand-toggle", "icon-button");
    icon.dataset.collapse = true;
    title.appendChild(icon);

    const text = document.createElement("span");
    text.innerText = "Advanced";
    title.appendChild(text);

    title.addEventListener("click", () => {
      if (advancedBody.style.display === "none") {
        advancedBody.style.display = "";
        delete icon.dataset.collapse;
      } else {
        advancedBody.style.display = "none";
        icon.dataset.collapse = true;
      }
    });
    return advancedToggle;
  }

  createAdvancedBody() {
    const body = document.createElement("div");
    body.style.display = "none";
    body.classList.add("sidebar-body");
    for (const elem in this.model.elems) {
      if (cosmologyParams[elem].advanced === true)
        body.appendChild(this.model.elems[elem].container);
    }
    return body;
  }

  resizeTitle() {
    this.style.width = this.value.length + 2 + "ch";
  }

  addName(name, instance) {
    let uniqueName;

    const names = [];
    const modelNames = document.getElementsByClassName("model-name");
    for (let i = 0; i < modelNames.length; i++) {
      if (instance != modelNames[i]) names.push(modelNames[i].value);
    }

    if (names.includes(name)) {
      let i = 1;
      while (names.includes(name + " (" + i + ")")) i++;
      uniqueName = name + " (" + i + ")";
    } else {
      uniqueName = name;
    }

    names.push(uniqueName);

    this.model.params.name = uniqueName;

    return uniqueName;
  }
}

export { SidebarModel };
