import { SidebarModel } from './Sidebar.Model.js';

function Sidebar() {

    const dom = this.dom = document.createElement('div');
    dom.id = "sidebar";

    const models = this.models = [];

    const title = document.createElement('h1');
    title.innerText = "Models";
    dom.appendChild(title);

    const addButton = document.createElement('button');
    addButton.id = "test";
    addButton.classList.add("add-model");
    addButton.innerText = "Add model";

    dom.appendChild(addButton);

    const modelContainer = document.createElement('div');
    modelContainer.classList.add("model-container")
    dom.appendChild(modelContainer);

    // add sidebar model
    function onClick( event ) {
        const sidebarModel = new SidebarModel(models);
        models.push(sidebarModel.model.params);

        modelContainer.appendChild(sidebarModel.dom);
    }

    addButton.addEventListener("click", onClick)
}

export { Sidebar };