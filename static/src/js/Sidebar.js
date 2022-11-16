import { SidebarModel } from './Sidebar.Model.js';

function Sidebar() {

    const dom = document.createElement('div');
    dom.id = "sidebar";

    const title = document.createElement('h1');
    title.innerText = "Models";
    dom.appendChild(title);

    const modelContainer = document.createElement('div');
    dom.appendChild(modelContainer);

    const addButton = document.createElement('button');
    addButton.id = "test";
    addButton.classList.add("add-model");

    function onClick( event ) {
        const sidebarModel = new SidebarModel();

        modelContainer.appendChild( sidebarModel);
    }

    addButton.addEventListener("click", onClick)

    addButton.innerText = "Add model";
    dom.appendChild(addButton);

    return dom;
}

export { Sidebar };