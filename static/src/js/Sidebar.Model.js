function SidebarModel() {

    let open = true;

    const dom = document.createElement('div');
    dom.classList.add('sidebar-model');

    const header = document.createElement('div');
    header.classList.add('sidebar-header');

    const headerOpen = document.createElement('img');
    headerOpen.classList.add('sidebar-icon');
    headerOpen.src = 'static/dist/chevron-down.svg';
    header.appendChild(headerOpen);

    const headerEnabled = document.createElement('input');
    headerEnabled.type="checkbox";
    header.appendChild(headerEnabled);

    const headerTitle = document.createElement('h2');
    headerTitle.innerText = "Model 1";
    header.appendChild(headerTitle);

    dom.appendChild(header);

    return dom;
}

export { SidebarModel };