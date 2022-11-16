import { Sidebar } from './Sidebar.js';
import { Resizer } from './Resizer.js';
import { Output } from './Output.js';

const sidebar = new Sidebar();
document.body.appendChild( sidebar );

const resizer = new Resizer();
document.body.appendChild( resizer );

const output = new Output();
document.body.appendChild( output );

function request(url, func){
    const request = new XMLHttpRequest();
    request.addEventListener('readystatechange', function( event ) {
        if (this.readyState == 4 && this.status == 200) {
           func(this);
        }
    });
    request.open("GET", "/" + url, true);
    request.send();
}

document.getElementById("test").addEventListener('click', () => {
    request('test', (request) => {
        document.getElementById('output').innerHTML = request.response
    });
});