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
      for (const input of tabs[name]) {
        const label = input.label;
        const type = input.type;
        const value = input.value;

        switch (type) {
          case "float":
            tabContainer.data[label] = value.default;
            break;
          case "radio":
            tabContainer.data[label] = value[0];
            break;
          case "range":
            tabContainer.data[label] = [value.default[0], value.default[1]];
            break;
          case "bool":
            tabContainer.data[label] = value;
        }

        const elem = new Input(label, type, value, "UNDEFINED", (event) => {
          let newValue;

          switch (type) {
            case "float":
              newValue = parseFloat(event.target.value);
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
            case "bool":
              newValue = event.target.checked;
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
