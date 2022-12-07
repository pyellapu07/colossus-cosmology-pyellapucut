import { SidebarModel } from './Sidebar.Model.js';

function Sidebar() {

    const dom = document.createElement('div');
    dom.id = "sidebar";

    const title = document.createElement('h1');
    title.innerText = "Models";
    dom.appendChild(title);

    const addButton = document.createElement('button');
    addButton.id = "test";
    addButton.classList.add("add-model");
    addButton.innerText = "Add model";

    function onClick( event ) {
        const sidebarModel = new SidebarModel();

        modelContainer.appendChild( sidebarModel);
    }

    addButton.addEventListener("click", onClick)

    dom.appendChild(addButton);

    const modelContainer = document.createElement('div');
    modelContainer.classList.add("model-container")
    dom.appendChild(modelContainer);

    return dom;
}

export { Sidebar };