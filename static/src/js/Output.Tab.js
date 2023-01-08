const tabs = {
    "Basic": [],
    "Time": [],
    "Distance": [],
    "Content": [],
    "Power Spectrum ": [],
    "Correlation": [],
    "Peak Height": [],

}

function OutputTab() {

    const tab = this.dom = document.createElement('div');

    const header = document.createElement('div');
    tab.appendChild(header);

    const content = document.createElement('div');
    tab.appendChild(content);
}

export { OutputTab };