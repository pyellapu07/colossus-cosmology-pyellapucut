import cosmoModule from "../../config/cosmoModule.js";
import "../../../dist/plotly.min.js"; // Plotly
import { Tooltip } from "../components/Tooltip.js";

class OutputResult {
  constructor() {
    const dom = (this.dom = document.createElement("div"));
    dom.id = "result";
  }

  clear() {
    this.dom.innerHTML = "";
  }

  visualize(responseData, status) {
    this.clear();

    if (status === 200) {
      for (const data of responseData) {
        switch (data.type) {
          case "table":
            this.tabulate(data.csv);
            break;
          case "plot":
            this.plot(
              data.x,
              data.y,
              data.names,
              data.title,
              data.xTitle,
              data.yTitle
            );
            break;
        }
      }
    } else if (status === 500) {
      this.error(responseData);
    }
  }

  error(responseData) {
    const frame = document.createElement("iframe");
    frame.srcdoc = responseData;

    frame.addEventListener("load", () => {
      const style = getComputedStyle(frame);
      frame.style.height =
        frame.contentWindow.document.documentElement.offsetHeight + 100 + "px";
    });

    this.dom.appendChild(frame);
  }

  tabulate(csv) {
    const table = document.createElement("table");
    let currentSection;

    for (const row of csv) {
      const tr = document.createElement("tr");

      if (row[0] in cosmoModule) {
        const th = document.createElement("th");
        th.colSpan = 100;
        th.innerText = currentSection = row[0];
        tr.appendChild(th);
      } else {
        for (const cell of row) {
          const td = document.createElement("td");
          td.innerText = cell;
          tr.appendChild(td);
        }

        if (currentSection !== undefined) {
          const tdLabel = tr.firstChild;
          const tdUnit = tr.insertBefore(
            document.createElement("td"),
            tdLabel.nextSibling
          );

          const labelInfo = cosmoModule[currentSection][tdLabel.innerText];
          tdUnit.innerHTML = labelInfo.unit === "" ? "—" : labelInfo.unit;

          const label = document.createElement("label");
          label.innerText = tdLabel.innerText;

          tdLabel.innerText = "";
          tdLabel.appendChild(label);

          const tooltip = new Tooltip(label, labelInfo.def);
        }
      }

      table.appendChild(tr);
    }

    this.dom.appendChild(table);
  }

  plot(x, y, names, title, xTitle, yTitle) {
    const plot = document.createElement("div");
    plot.classList.add("plot");

    // x is an array where y is a 2d array
    if (!Array.isArray(x[0])) {
      x = Array(y.length).fill(x);
    }

    const lines = [];

    for (let i = 0; i < y.length; i++)
      lines.push({
        x: x[i],
        y: y[i],
        name: names[i],
      });

    Plotly.newPlot(
      plot,
      lines,
      {
        title: title,
        xaxis: {
          title: xTitle,
          // rangemode: "tozero",
        },
        yaxis: {
          title: yTitle,
          // rangemode: "tozero",
        },
      },
      {
        toImageButtonOptions: {
          format: "png", // one of png, svg, jpeg, webp
          filename: title,
          scale: 5, // scaled resolution (x5); now 3500 × 2250 pixels
        },
      }
    );

    // download as CSV
    const modebarGroup = plot.getElementsByClassName("modebar-group")[0];

    // create csv content as rows of x and y
    const columns = [];
    columns.push([xTitle, ...names]);

    for (const i in x[0]) {
      const row = [x[0][i]];

      for (const j of y) {
        row.push(j[i]);
      }

      columns.push(row);
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      columns.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);

    // create download link
    const downloadCSV = document.createElement("a");
    downloadCSV.setAttribute("rel", "tooltip");
    downloadCSV.setAttribute("download", title + ".csv");
    downloadCSV.setAttribute("href", encodedUri);
    downloadCSV.classList.add("modebar-btn");
    downloadCSV.dataset.title = "Download data as a csv";
    downloadCSV.dataset.toggle = "false";
    downloadCSV.dataset.gravity = "n";
    downloadCSV.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 16 16" class="icon"><path d="M8 9l4-4h-3v-4h-2v4h-3zM11.636 7.364l-1.121 1.121 4.064 1.515-6.579 2.453-6.579-2.453 4.064-1.515-1.121-1.121-4.364 1.636v4l8 3 8-3v-4z"/></svg>';

    downloadCSV.addEventListener("pointerdown", () => {
      console.log("here");
    });

    modebarGroup.prepend(downloadCSV);

    this.dom.appendChild(plot);
  }
}

export { OutputResult };
