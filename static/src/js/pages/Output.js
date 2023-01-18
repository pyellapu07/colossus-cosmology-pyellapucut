import { OutputTab } from './Output.Tab.js';

class Output {

	constructor( main ) {

		this.data = main.data;

		const dom = this.dom = document.createElement( 'div' );
		dom.id = 'output';

		const tab = new OutputTab( main.data );
		dom.appendChild( tab.dom );

		const table = document.createElement( 'div' );
		table.id = 'table';
		dom.appendChild( table );

	}

	runModel() {

		this.request( 'output', this.data, ( responseData ) => {

			console.log( responseData );

		} );

	}

	request( url, data, func ) {

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

}

export { Output };
