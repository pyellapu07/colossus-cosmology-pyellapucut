import { Model } from './Model.js';
import { Cosmology } from './Cosmology.js';

function SidebarModel( models, type ) {

    const dom = this.dom = document.createElement('div');
    dom.classList.add('sidebar-model');

    // header
    const header = document.createElement('div');
    header.classList.add('sidebar-header');

    // header expand toggle
    const expandToggle = document.createElement('div');
    expandToggle.classList.add('expand-toggle');
    header.appendChild(expandToggle);

    // header title
    const headerTitle = document.createElement('input');
    headerTitle.value = addName(type);
    headerTitle.classList.add('model-name');

    function resizetitle() {
        this.style.width = this.value.length + "ch";
    }

    headerTitle.addEventListener('input', resizetitle);
    headerTitle.addEventListener('change', function() {
        if (this.value == '')
            this.value = addName("Model")
        else
            this.value = addName(this.value, headerTitle);
    });

    resizetitle.call(headerTitle);

    header.appendChild(headerTitle);

    // header enable toggle
    const enabledToggle = document.createElement('input');
    enabledToggle.type = "checkbox";
    enabledToggle.classList.add("checkbox", "enable-toggle")
    enabledToggle.checked = true;
    header.appendChild(enabledToggle);

    // header delete
    const trash = document.createElement('button');
    trash.classList.add('trash');
    header.appendChild(trash);

    // body
    const body = document.createElement('div');
    body.classList.add('sidebar-body');

    // body expand toggle
    let open = true;

    header.addEventListener('click', function(e) {
        if (e.target == header || e.target == expandToggle) {
            open = !open;

            if (open) {
                body.style.removeProperty("display");
                expandToggle.style.removeProperty("transform");
            }
            else {
                body.style.display = "none";
                expandToggle.style.transform = "rotateZ(180deg)";
            }

        }

    })

    trash.addEventListener('click', function() {
        models.splice(models.indexOf(this), 1);
        dom.remove();
    })

    dom.appendChild(header);

    const model = this.model = new Model(body, Cosmology[type]);

    dom.appendChild(body);
}

function addName( name, instance ) {
    let uniqueName;

    const names = [];
    const modelNames = document.getElementsByClassName("model-name");
    for (let i = 0; i < modelNames.length; i++) {
        if (instance != modelNames[i] )
            names.push(modelNames[i].value);
    }

    if (names.includes(name)) {
        let i = 1;
        while (names.includes(name + " (" + i + ")"))
            i++;
        uniqueName = name + " (" + i + ")";
    } else {
        uniqueName = name;
    }

    names.push(uniqueName);

    return uniqueName;
}

export { SidebarModel };