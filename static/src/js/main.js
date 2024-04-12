import { Data } from "./components/Data.js";

import { Header } from "./pages/Header.js";
import { Sidebar } from "./pages/Sidebar.js";
import { Resizer } from "./pages/Resizer.js";
import { Output } from "./pages/Output.js";
import { Footer } from "./pages/Footer.js";

const main = {};
main.data = new Data(main);

const dom = document.body;

const header = (main.header = new Header(main));
dom.appendChild(header.dom);

const mainContainer = document.createElement("div");
mainContainer.id = "main-container";
dom.appendChild(mainContainer);

const sidebar = (main.sidebar = new Sidebar(main));
mainContainer.appendChild(sidebar.dom);

const resizer = (main.resizer = new Resizer());
dom.appendChild(resizer.dom);

const output = (main.output = new Output(main));
mainContainer.appendChild(output.dom);

const footer = (main.footer = new Footer());
dom.appendChild(footer.dom);

sidebar.dom.querySelector(".add-model").click();
