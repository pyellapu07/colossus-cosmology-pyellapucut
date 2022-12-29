function Header() {

    const dom = this.dom = document.createElement('div');
    dom.classList.add("header");

    const title = document.createElement('h2');
    title.innerText = "Colossus Web Calculator";
    dom.appendChild(title);

    const info = document.createElement('button');
    info.classList.add('info');
    dom.appendChild(info);

}

export { Header };