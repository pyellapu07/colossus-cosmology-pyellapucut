function SidebarModel() {

    const dom = document.createElement('div');
    dom.classList.add('sidebar-model');

    const header = document.createElement('div');
    header.classList.add('sidebar-header');

    const expandToggle = document.createElement('input');
    expandToggle.type="checkbox";
    expandToggle.classList.add('sidebar-expand');
    header.appendChild(expandToggle);

    let open = true;

    function onClick( event ) {
        open = !open;
    }

    const enabledToggle = document.createElement('input');
    enabledToggle.type="checkbox";
    enabledToggle.classList.add("sidebar-enabled")
    enabledToggle.checked = true;
    header.appendChild(enabledToggle);

    const headerTitle = document.createElement('h2');
    headerTitle.innerText = "Model 1";
    header.appendChild(headerTitle);

    dom.appendChild(header);

    return dom;
}

export { SidebarModel };