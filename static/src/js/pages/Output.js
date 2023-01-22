import { OutputTab } from './Output.Tab.js';
import { OutputResult } from './Output.Result.js';

class Output {

	constructor( main ) {

		this.data = main.data;

		const dom = this.dom = document.createElement( 'div' );
		dom.id = 'output';

		const tab = new OutputTab( main.data );
		dom.appendChild( tab.dom );

		const result = this.result = new OutputResult();
		dom.appendChild( result.dom );

	}

	runModel() {

		this.request( this.data, ( response ) => {

			this.result.visualize( response );

		} );

	}

	request( data, func ) {

		const url = data.tab.name;

		const xhr = new XMLHttpRequest();
		xhr.open( 'POST', '/' + url, true );
		xhr.setRequestHeader( 'Content-Type', 'application/json' );
		xhr.addEventListener( 'readystatechange', () => {

			if ( xhr.readyState == 4 && xhr.status == 200 ) {

				let response = xhr.responseText;

				func( JSON.parse( response ) );

			}

		} );

		xhr.send( JSON.stringify( data ) );

	}

}

export { Output };
