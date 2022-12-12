class Model {
    constructor(body) {
        this.body = body;
        this.params = {};
    }

    createOption(name, type, val) {
        this.params[name] = val;

        const container = document.createElement('div');
        container.classList.add('sidebar-option');

        const title = document.createElement('span');
        title.innerText = name;

        container.appendChild(title);

        const input = document.createElement('input');

        switch (type) {
            case 'bool':
                input.type="checkbox";
                input.classList.add("checkbox");
                input.checked = val;
                input.addEventListener( 'change', (event) => {
                    this.params[name] = event.target.checked;
                });
                break;
            case 'float':
                input.type="number";
                input.classList.add("textbox");
                input.value = val;
                input.addEventListener( 'change', (event) => {
                    this.params[name] = parseFloat(event.target.value);
                });
                break;
        }

        container.appendChild(input);

        this.body.appendChild(container);
    }
}

function SidebarModel( models ) {

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
    headerTitle.value = "Model 1";
    headerTitle.classList.add('model-name');
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

    header.addEventListener('click', ( event ) => {

        if (event.target == header || event.target == expandToggle) {
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

    trash.addEventListener('click', () => {
        models.splice(models.indexOf(this), 1);
        dom.remove();
    })

    dom.appendChild(header);

    const model = this.model = new Model(body);

    // body options
    // TODO: add de_model and associated params
    // TODO: add power_law and associated params
    model.createOption("flat", "bool", true);
    model.createOption("H0", "float", 67.66);
    model.createOption("Om0", "float", 0.3111);
    // model.createOption("Ode0", "float", 0.0490));
    model.createOption("Ob0", "float", 0.0490);
    model.createOption("sigma8", "float", 0.8102);
    model.createOption("ns", "float", 0.9665);
    model.createOption("relspecies", "bool", true);
    // model.createOption("Tcmb0", "float", 2.7255);
    // model.createOption("Neff", "float", 3.046);
    model.createOption("power_law", "bool", false);
    // model.createOption("power_law_n", "float", 0.0);

    dom.appendChild(body);
}

export { SidebarModel };