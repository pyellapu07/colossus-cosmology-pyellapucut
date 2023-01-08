import { CosmologyFormat } from './Cosmology.js';

class Model {
    constructor(body, cosmo) {
        this.body = body;
        this.cosmo = cosmo;
        this.params = {};
        this.elems = {};

        this.createOption("flat", "bool", {"Ode0": false});
        this.createOption("Ode0", "float");
        this.createOption("H0", "float");
        this.createOption("Om0", "float");
        this.createOption("Ob0", "float");
        this.createOption("sigma8", "float");
        this.createOption("ns", "float");
        this.createOption("relspecies", "bool");

        for (const elem in this.elems) {
            this.updateParams(elem, this.params[elem], this.elems[elem][1]);
        }
    }

    createOption(name, type, dependencies) {
       let val = this.cosmo[name];

        const container = document.createElement('div');
        container.classList.add('sidebar-option');

        const titleContainer = document.createElement('div');
        titleContainer.classList.add('option-title');

        const title = document.createElement('span');
        title.innerHTML = CosmologyFormat[name].text;
        title.tabIndex = 0;
        titleContainer.appendChild(title);

        const tooltip = document.createElement('div');
        tooltip.classList.add('option-tooltip');
        tooltip.innerHTML = CosmologyFormat[name].def;
        titleContainer.appendChild(tooltip);

        container.appendChild(titleContainer);

        const input = document.createElement('input');

        switch (type) {
            case 'bool':
                if (val == undefined)
                    val = true;
                input.type="checkbox";
                input.classList.add("checkbox");
                input.checked = val;
                input.addEventListener( 'change', (event) => {
                    this.updateParams(name, event.target.checked, dependencies);
                });
                break;
            case 'float':
                if (val == undefined)
                    val = 0;
                input.type="number";
                input.classList.add("textbox");
                input.value = val;
                input.addEventListener( 'change', (event) => {
                    this.updateParams(name, event.target.value, dependencies);
                });
                break;
        }

        this.params[name] = val;

        container.appendChild(input);

        this.elems[name] = [container, dependencies];
        this.body.appendChild(container);
    }

    updateParams(name, value, dependencies) {
        this.params[name] = event.target.checked;

        if (dependencies != undefined) {
            for (const key in dependencies) {
                this.elems[key][0].style.display = dependencies[key] == value ? "" : "none";
            }
        }
    }
}

export { Model };