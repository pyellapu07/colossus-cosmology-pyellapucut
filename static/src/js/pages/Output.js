import { OutputTab } from './Output.Tab.js';

function Output( sidebar ) {

	const models = sidebar.models;

	const dom = this.dom = document.createElement( 'div' );
	dom.id = 'output';

	// const runButton = document.createElement('button');
	// runButton.classList.add('run-model');
	// runButton.innerText = 'Run model';
	// runButton.addEventListener('click', () => {
	//     request('test', models, (data) => {
	//         document.getElementById('table').innerHTML = JSON.stringify(data);
	//     });
	// });
	// dom.appendChild(runButton);

	const tab = new OutputTab();
	dom.appendChild( tab.dom );

	const table = document.createElement( 'div' );
	table.id = 'table';
	dom.appendChild( table );

}

function request( url, data, func ) {

	const xhr = new XMLHttpRequest();
	xhr.open( 'POST', '/' + url, true );
	xhr.setRequestHeader( 'Content-Type', 'application/json' );
	xhr.addEventListener( 'readystatechange', () => {

		if ( xhr.readyState == 4 && xhr.status == 200 ) {

			func( JSON.parse( xhr.responseText ) );

		}

	} );
	xhr.send( JSON.stringify( data ) );

}

export { Output };
