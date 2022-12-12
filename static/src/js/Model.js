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

export { Model };