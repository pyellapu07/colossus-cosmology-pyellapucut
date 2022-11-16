function Output() {

    const dom = document.createElement('div');
    dom.id = "output";

    const title = document.createElement('h1');
    title.innerText = "Output";
    dom.appendChild(title);

    return dom;
}

export { Output };