import { SidebarModel } from './Sidebar.Model.js';
import { Cosmology } from './Cosmology.js';

function Sidebar() {

    const dom = this.dom = document.createElement('div');
    dom.id = "sidebar";

    const models = this.models = [];

    // const title = document.createElement('h1');
    // title.innerText = "Cosmologies";
    // dom.appendChild(title);

    const selectModel = document.createElement('select');
    selectModel.classList.add('select');
    for (const model in Cosmology) {
        const option = document.createElement("option");
        option.value = model;
        option.text = model;
        selectModel.appendChild(option);
    }

    dom.appendChild(selectModel);

    const addButton = document.createElement('button');
    addButton.id = "test";
    addButton.classList.add("add-model");
    addButton.innerText = "Add model";

    dom.appendChild(addButton);

    const modelContainer = document.createElement('div');
    modelContainer.classList.add("model-container")
    dom.appendChild(modelContainer);

    // add sidebar model
    addButton.addEventListener("click", () => {
        const sidebarModel = new SidebarModel(models, selectModel.value);
        models.push(sidebarModel.model.params);

        modelContainer.appendChild(sidebarModel.dom);
    });

    const runButton = document.createElement('button');
    runButton.classList.add("run-model");
    runButton.innerText = "Run model";
    runButton.addEventListener('click', () => {
        request('test', models, (data) => {
            document.getElementById('table').innerHTML = JSON.stringify(data);
        });
    });
    dom.appendChild(runButton)
}

function request(url, data, func){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/" + url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
           func(JSON.parse(xhr.responseText));
        }
    });
    xhr.send(JSON.stringify(data));
}

export { Sidebar };