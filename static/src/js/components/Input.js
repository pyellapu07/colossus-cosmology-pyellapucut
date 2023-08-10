import { Tooltip } from "./Tooltip.js";

let counter = 0;

class Input {
  constructor(format, defaultValue, onChange) {
    const type = format.type;
    const label = format.label;

    const dom = (this.dom = document.createElement("div"));
    dom.classList.add("input-container");

    const titleWrapper = document.createElement("div");
    titleWrapper.classList.add("title-wrapper");
    dom.appendChild(titleWrapper);

    const title = document.createElement("label");
    title.classList.add("title");
    title.innerHTML = label;
    titleWrapper.appendChild(title);

    const tooltip = new Tooltip(title, format.def || "UNDEFINED");

    const input =
      type == "radio" || type == "range" ? [] : document.createElement("input");
    const inputWrapper = document.createElement("div");
    inputWrapper.classList.add("input-wrapper");

    const groupId = label + counter++;

    switch (type) {
      case "bool":
        input.type = "checkbox";
        input.classList.add("checkbox");
        input.checked = defaultValue;
        break;
      case "float":
        input.type = "number";
        input.classList.add("textbox");
        input.value =
          defaultValue >= 10000 ? defaultparams.toExponential() : defaultValue;
        input.min = format.min;
        input.max = format.max;
        input.step = format.step;
        break;
      case "range":
        const minFieldset = document.createElement("fieldset");
        minFieldset.classList.add("fieldset");

        const maxFieldset = document.createElement("fieldset");
        maxFieldset.classList.add("fieldset");

        const minLabel = document.createElement("label");
        minLabel.innerText = "min";

        const maxLabel = document.createElement("label");
        maxLabel.innerText = "max";

        const minBox = document.createElement("input");
        minBox.type = "number";
        minBox.classList.add("textbox");
        minBox.dataset.type = "min";
        minBox.value =
          defaultValue[0] >= 10000
            ? defaultValue[0].toExponential()
            : defaultValue[0];
        minBox.min = format.min;
        minBox.max = format.max;
        minBox.step = format.step;

        const maxBox = document.createElement("input");
        maxBox.type = "number";
        maxBox.classList.add("textbox");
        maxBox.dataset.type = "max";
        maxBox.value =
          defaultValue[1] >= 10000
            ? defaultValue[1].toExponential()
            : defaultValue[1];
        maxBox.min = format.min;
        maxBox.max = format.max;
        maxBox.step = format.step;

        input.push(minBox);
        input.push(maxBox);

        minFieldset.appendChild(minLabel);
        minFieldset.appendChild(minBox);
        maxFieldset.appendChild(maxLabel);
        maxFieldset.appendChild(maxBox);

        inputWrapper.appendChild(minFieldset);
        inputWrapper.appendChild(maxFieldset);

        break;
      case "radio":
        for (const option of format.options) {
          const radioLabel = option.label;
          const radioValue =
            option.value === undefined ? option.label : option.value;

          const fieldset = document.createElement("fieldset");
          fieldset.classList.add("fieldset");

          const uniqueId = label + radioLabel + counter++;

          const secondaryLabel = document.createElement("label");
          secondaryLabel.innerHTML = radioLabel;
          secondaryLabel.htmlFor = uniqueId;

          const radio = document.createElement("input");
          radio.type = "radio";
          radio.id = uniqueId;
          radio.name = groupId;
          radio.value = radioValue;
          radio.classList.add("radio");

          input.push(radio);

          fieldset.appendChild(radio);
          fieldset.appendChild(secondaryLabel);

          inputWrapper.appendChild(fieldset);
        }

        input[0].checked = true;
        break;
    }

    function onChangeWrapper(event) {
      let newValue;

      if (type == "bool") {
        newValue = event.target.checked;
      } else if (type === "float" || type === "range") {
        newValue = parseFloat(event.target.value);
        if (newValue >= 10000) newValue = newValue.toExponential();

        if (
          event.target.min !== undefined &&
          newValue < parseFloat(event.target.min)
        )
          newValue = parseFloat(event.target.min);
        if (
          event.target.max !== undefined &&
          newValue > parseFloat(event.target.max)
        )
          newValue = parseFloat(event.target.max);
      } else {
        newValue = event.target.value;
      }

      event.target.value = newValue;

      onChange(event);
    }

    if (input instanceof Array) {
      for (const i of input) {
        i.addEventListener("change", onChangeWrapper);
      }
    } else {
      input.addEventListener("change", onChangeWrapper);
      inputWrapper.appendChild(input);
    }

    dom.appendChild(inputWrapper);
  }
}

export { Input };
