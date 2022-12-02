function SidebarModel() {

    const dom = document.createElement('div');
    dom.classList.add('sidebar-model');

    // header
    const header = document.createElement('div');
    header.classList.add('sidebar-header');

    // header enable toggle
    const enabledToggle = document.createElement('input');
    enabledToggle.type="checkbox";
    enabledToggle.classList.add("checkbox")
    enabledToggle.checked = true;
    header.appendChild(enabledToggle);

    // header title
    const headerTitle = document.createElement('h2');
    headerTitle.innerText = "Model 1";
    header.appendChild(headerTitle);

    // header expand toggle
    const expandToggle = document.createElement('input');
    expandToggle.type="checkbox";
    expandToggle.classList.add('expand-toggle');
    header.appendChild(expandToggle);

    dom.appendChild(header);

    // body
    const body = document.createElement('div');
    body.classList.add('sidebar-body');

    // body expand toggle
    let open = true;

    function onClick( event ) {
        open = !open;

        if (open)
            body.style.maxHeight = "100%";
        else
            body.style.maxHeight = "0%";
    }

    expandToggle.addEventListener('click', onClick);

    // body options
    body.appendChild(createOption("Flat", "checkbox"));
    body.appendChild(createOption("Flat", "checkbox"));
    body.appendChild(createOption("Flat", "checkbox"));
    body.appendChild(createOption("Flat", "checkbox"));
    body.appendChild(createOption("Flat", "checkbox"));
    body.appendChild(createOption("Flat", "checkbox"));

    dom.appendChild(body);

    return dom;
}

function createOption(name, type) {
    const container = document.createElement('div');
    container.classList.add('sidebar-option');

    const title = document.createElement('span');
    title.innerText = name;

    container.appendChild(title);

    const input = document.createElement('input');

    switch (type) {
        case 'checkbox':
            input.type="checkbox";
            input.classList.add("checkbox");
            input.checked = true;
            break;
    }

    container.appendChild(input);

    return container;
}

export { SidebarModel };