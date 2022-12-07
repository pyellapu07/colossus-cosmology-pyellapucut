function Output() {

    const dom = document.createElement('div');
    dom.id = "output";

    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('title-wrapper');

    const title = document.createElement('h1');
    title.innerText = "Output";
    titleWrapper.appendChild(title);

    const runButton = document.createElement('button');
    runButton.classList.add("run-model");
    runButton.innerText = "Run model";
    titleWrapper.appendChild(runButton)

    dom.appendChild(titleWrapper);

    const table = document.createElement("div");
    table.classList.add("table");
    dom.appendChild(table);

    return dom;
}

export { Output };