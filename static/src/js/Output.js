function Output() {

    const dom = this.dom = document.createElement('div');
    dom.id = "output";

    const title = document.createElement('h1');
    title.innerText = "Output";
    dom.appendChild(title);

    const table = document.createElement("div");
    table.id = "table";
    dom.appendChild(table);
}

export { Output };