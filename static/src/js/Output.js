function request(url, data, func){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/" + url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
           func(JSON.parse(xhr.responseText));
        }
    });
    xhr.send(JSON.stringify(data));
}


function Output( sidebar ) {

    const dom = this.dom = document.createElement('div');
    dom.id = "output";

    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('title-wrapper');

    const title = document.createElement('h1');
    title.innerText = "Output";
    titleWrapper.appendChild(title);

    const runButton = document.createElement('button');
    runButton.classList.add("run-model");
    runButton.innerText = "Run model";
    runButton.addEventListener('click', (event) => {
        request('test', sidebar.models, (data) => {
            document.getElementById('table').innerHTML = JSON.stringify(data);
        });
    });
    titleWrapper.appendChild(runButton)

    dom.appendChild(titleWrapper);

    const table = document.createElement("div");
    table.id = "table";
    dom.appendChild(table);
}

export { Output };