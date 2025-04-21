import tabs from "../../config/tabs.js";
import { Input } from "../components/Input.js";
import { CompositionRenderer } from "./CompositionRenderer.js";

class OutputTab {
  constructor(data) {
    const tab = (this.dom = document.createElement("div"));
    tab.id = "tab";

    const header = document.createElement("div");
    header.classList.add("header");
    tab.appendChild(header);

    this.content = document.createElement("div");
    this.content.classList.add("content");
    tab.appendChild(this.content);

    let activeTab;
    this.compositionRenderer = null;
    let compositionDiv = null;  // Store composition div globally inside the class

    for (const name in tabs) {
      const tabContainer = {
        button: undefined,
        inputs: [],
        data: {},
      };

      const button = document.createElement("button");
      button.innerText = name;
      tabContainer.button = button;
      header.appendChild(button);

      for (const format of tabs[name]) {
        const label = format.label;
        const type = format.type;

        switch (type) {
          case "float":
            tabContainer.data[label] = format.default;
            break;
          case "radio":
            tabContainer.data[label] =
              format.options[0].value !== undefined
                ? format.options[0].value
                : format.options[0].label;
            break;
          case "range":
            tabContainer.data[label] = [format.default[0], format.default[1]];
            break;
          case "bool":
            tabContainer.data[label] = format.default;
        }

        const elem = new Input(format, format.default, (event) => {
          let newValue;

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
            case "range":
              newValue = [...tabContainer.data[label]];
              newValue[event.target.dataset.type == "min" ? 0 : 1] = parseFloat(
                event.target.value
              );
              break;
          }

          if (
            type === "range"
              ? newValue[0] !== tabContainer.data[label][0] ||
                newValue[1] !== tabContainer.data[label][1]
              : newValue !== tabContainer.data[label]
          ) {
            tabContainer.data[label] = newValue;
            data.needsUpdate();
          }

          if (format.label === "Plot as function of") {
            const domainDOM = elem.dom.nextElementSibling;
            const min = domainDOM.querySelector("[data-type='min']");
            const max = domainDOM.querySelector("[data-type='max']");
            switch (newValue) {
              case "Redshift (z)":
                min.min = max.min = -0.995;
                min.max = max.max = 200;
                min.value = 0;
                max.value = 10;
                break;
              case "Time (t)":
                min.min = max.min = 0;
                min.max = max.max = 100;
                min.value = 0;
                max.value = 14;
                break;
              case "Scale factor (a)":
                min.min = max.min = 0.005;
                min.max = max.max = 200;
                min.value = 0;
                max.value = 1;
                break;
            }
            var changeEvent = new Event("change");
            min.dispatchEvent(changeEvent);
            max.dispatchEvent(changeEvent);
          }
        });

        tabContainer.inputs.push(elem.dom);
      }

      const onTabSwitch = () => {
        if (activeTab !== undefined) {
          delete activeTab.button.dataset.selected;
          for (const input of activeTab.inputs) {
            delete input.dataset.selected;
          }
        }

        button.dataset.selected = "";
        activeTab = tabContainer;

        this.content.innerHTML = ""; // 🧹 Clear old content

        if (name !== "Composition") {
          for (const input of tabContainer.inputs) {
            input.dataset.selected = "";
            this.content.appendChild(input);
          }
        }

        // Create or show CompositionRenderer
        if (name === "Composition") {
          if (!compositionDiv) {
            compositionDiv = document.createElement("div");
            compositionDiv.id = "composition-container";
            compositionDiv.style.marginTop = "20px";
            this.content.appendChild(compositionDiv);

            this.compositionRenderer = new CompositionRenderer(compositionDiv);
          } else {
            this.content.appendChild(compositionDiv);
          }
          compositionDiv.style.display = ""; // show
        } else if (compositionDiv) {
          compositionDiv.style.display = "none"; // hide
        }

        data.tab = {
          name: name,
          inputs: tabContainer.data,
        };

        data.needsUpdate();
      };

      button.addEventListener("click", () => {
        onTabSwitch();
        data.needsUpdate();
      });

      if (name === "Basic") button.click(); // open Basic by default
    }

    const collapse = document.createElement("div");
    collapse.classList.add("tab-collapse", "icon-button");
    this.content.appendChild(collapse);

    collapse.addEventListener("click", () => {
      if ("collapse" in this.content.dataset) {
        delete this.content.dataset.collapse;
      } else {
        this.content.dataset.collapse = "";
      }
    });
  }
}

export { OutputTab };
