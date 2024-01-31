class Header {
  constructor(main) {
    const dom = (this.dom = document.createElement("div"));
    dom.id = "header";

    const logo = document.createElement("img");
    logo.src = "static/dist/logo.svg";
    logo.id = "logo";
    dom.appendChild(logo);

    const title = document.createElement("h2");
    title.innerText = "Colossus Cosmology Calculator";
    dom.appendChild(title);

    // right side
    const rightAlign = document.createElement("div");
    rightAlign.classList.add("right-align");

    const status = (this.status = document.createElement("span"));
    status.classList.add("status");

    const statusIcon = document.createElement("div");
    statusIcon.classList.add("status-icon");

    status.classList.add("up-to-date");
    status.innerText = "Up to date";

    rightAlign.appendChild(status);

    dom.appendChild(rightAlign);
  }
}

export { Header };
