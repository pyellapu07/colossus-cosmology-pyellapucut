function SidebarModel() {

    const dom = document.createElement('div');
    dom.classList.add('sidebar-model');

    // const xhr = new XMLHttpRequest();
    // xhr.open("GET","/static/dist/plus.svg",false);
    // // Following line is just to be on the safe side;
    // // not needed if your server delivers SVG with correct MIME type
    // xhr.overrideMimeType("image/svg+xml");
    // xhr.onload = function(e) {
    //   // You might also want to check for xhr.readyState/xhr.status here
    //   addButton.prepend(xhr.responseXML.documentElement);
    // };
    // xhr.send();

    return dom;
}

export { SidebarModel };