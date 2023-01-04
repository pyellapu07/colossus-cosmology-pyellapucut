const infoContent = [
    ["© 2014-2022 Benedikt Diemer", null],
    ["National Science Foundation", null],
    ["Code paper", "https://ui.adsabs.harvard.edu/abs/2018ApJS..239...35D/abstract"],
    ["Repository", "https://bitbucket.org/bdiemer/colossus"],
    ["Documentation", "https://bdiemer.bitbucket.io/colossus/"],
];

function Header() {

    const dom = this.dom = document.createElement('div');
    dom.id = "header";

    const logo = document.createElement('img');
    logo.src = "static/dist/logo.svg";
    dom.appendChild(logo);

    const title = document.createElement('h2');
    title.innerText = "Colossus Web Calculator";
    dom.appendChild(title);

    const info = document.createElement('div');
    info.classList.add("dropdown");
    info.title = "Information";
    info.tabIndex = 0;

    const infoTitle = document.createElement('div');
    infoTitle.id = "info";
    info.appendChild(infoTitle);

    const dropdown = document.createElement('div');
    dropdown.classList.add("options");

    for (const content of infoContent) {
        const isLink = content[1] != null;
        const elem = document.createElement(isLink ? "a" : "span");
        elem.classList.add("option")
        elem.innerText = content[0];

        if (isLink)
            elem.href = content[1];

        dropdown.appendChild(elem);
    }

    info.appendChild(dropdown);
    dom.appendChild(info);

}

export { Header };