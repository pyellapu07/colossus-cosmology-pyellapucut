import './resizer.js';

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