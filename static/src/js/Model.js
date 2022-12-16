class Model {
    constructor(body, cosmo) {
        this.body = body;
        this.cosmo = cosmo;
        this.params = {};

        this.createOption("flat", "bool");
        this.createOption("H0", "float");
        this.createOption("Om0", "float", 0.3111);
        this.createOption("Ob0", "float", 0.0490);
        this.createOption("sigma8", "float", 0.8102);
        this.createOption("ns", "float", 0.9665);
        this.createOption("relspecies", "bool", true);
    }

    createOption(name, type) {
       let val = this.cosmo[name];

        const container = document.createElement('div');
        container.classList.add('sidebar-option');

        const title = document.createElement('span');
        title.innerText = name;

        container.appendChild(title);

        const input = document.createElement('input');

        switch (type) {
            case 'bool':
                if (val == undefined)
                    val = true;
                input.type="checkbox";
                input.classList.add("checkbox");
                input.checked = val;
                input.addEventListener( 'change', (event) => {
                    this.params[name] = event.target.checked;
                });
                break;
            case 'float':
                if (val == undefined)
                    val = 0;
                input.type="number";
                input.classList.add("textbox");
                input.value = val;
                input.addEventListener( 'change', (event) => {
                    this.params[name] = parseFloat(event.target.value);
                });
                break;
        }

        this.params[name] = val;

        container.appendChild(input);

        this.body.appendChild(container);
    }
}

export { Model };