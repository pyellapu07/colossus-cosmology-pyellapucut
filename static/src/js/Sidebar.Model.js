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
    expandToggle.classList.add('expand-toggle', 'tooltip');
    header.appendChild(expandToggle);

    const expandTooltip = document.createElement('div');
    expandTooltip.classList.add('tooltip-content');
    expandTooltip.innerText = "Expand model";
    expandToggle.appendChild(expandTooltip);

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
    const enabledToggle = document.createElement('div');
    enabledToggle.tabIndex = 0;
    enabledToggle.classList.add("checkbox", "enable-toggle", 'tooltip')
    enabledToggle.dataset.checked = '';

    enabledToggle.addEventListener('click', () => {
        if ('checked' in enabledToggle.dataset)
            delete enabledToggle.dataset.checked;
        else
            enabledToggle.dataset.checked = '';
    })

    header.appendChild(enabledToggle);

    const enabledTooltip = document.createElement('div');
    enabledTooltip.classList.add('tooltip-content');
    enabledTooltip.innerText = "Show/hide in output"
    enabledToggle.appendChild(enabledTooltip);

    // header delete
    const trash = document.createElement('button');
    trash.classList.add('trash', 'tooltip');
    header.appendChild(trash);

    const trashTooltip = document.createElement('div');
    trashTooltip.classList.add('tooltip-content');
    trashTooltip.innerText = "Delete model"
    trash.appendChild(trashTooltip);

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
                delete expandToggle.dataset.collapse;
            }
            else {
                body.style.display = "none";
                expandToggle.dataset.collapse = '';
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