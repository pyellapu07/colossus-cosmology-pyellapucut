import tabs from "../../config/tabs.js";
import { Input } from "../components/Input.js";

class OutputTab {
  constructor(data) {
    const tab = (this.dom = document.createElement("div"));
    tab.id = "tab";

    const header = document.createElement("div");
    header.classList.add("header");
    tab.appendChild(header);

    const content = document.createElement("div");
    content.classList.add("content");
    tab.appendChild(content);

    let activeTab;

    for (const name in tabs) {
      const tabContainer = {
        button: undefined,
        inputs: [],
        data: {},
      };

      // header tabs
      const button = document.createElement("button");
      button.innerText = name;
      tabContainer.button = button;
      header.appendChild(button);

      // content
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

          // hardcoded for "plot as a function of"
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

        content.appendChild(elem.dom);
        tabContainer.inputs.push(elem.dom);
      }

      function onTabSwitch() {
        if (activeTab != undefined) {
          delete activeTab.button.dataset.selected;

          for (const input of activeTab.inputs) {
            delete input.dataset.selected;
          }
        }

        button.dataset.selected = "";
        activeTab = tabContainer;

        for (const input of tabContainer.inputs) {
          input.dataset.selected = "";
        }

        data.tab = {
          name: name,
          inputs: tabContainer.data,
        };
      }

      // switching tabs
      button.addEventListener("click", () => {
        onTabSwitch();
        data.needsUpdate();
      });

      if (name == "Basic") onTabSwitch();
    }

    // collapse
    const collapse = document.createElement("div");
    collapse.classList.add("tab-collapse", "icon-button");
    content.appendChild(collapse);

    collapse.addEventListener("click", () => {
      if ("collapse" in content.dataset) {
        delete content.dataset.collapse;
      } else content.dataset.collapse = "";
    });
  }
}

export { OutputTab };
