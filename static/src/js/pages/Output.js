import { OutputTab } from './Output.Tab.js';
import { OutputResult } from './Output.Result.js';

class Output {

	constructor( main ) {

		this.data = main.data;
		this.status = main.header.status;

		const dom = this.dom = document.createElement( 'div' );
		dom.id = 'output';

		const tab = new OutputTab( main.data );
		dom.appendChild( tab.dom );

		const result = this.result = new OutputResult();
		dom.appendChild( result.dom );

	}

	runModel() {

		this.request( this.data, ( response, status ) => {

			this.result.visualize( response, status );

			this.status.classList.remove( 'loading' );
			this.status.classList.add( 'up-to-date' );
			this.status.innerText = 'Up to date';

		} );

	}

	request( data, func ) {

		if ( data.models.length > 0 ) {

			const url = data.tab.name;

			const xhr = new XMLHttpRequest();
			xhr.open( 'POST', '/' + url, true );
			xhr.setRequestHeader( 'Content-Type', 'application/json' );
			xhr.addEventListener( 'readystatechange', () => {

				if ( xhr.readyState == 4 ) {

					let response = xhr.responseText;

					if ( xhr.status == 200 )
						response = JSON.parse( response );

					func( response, xhr.status );

				}

			} );

			xhr.send( JSON.stringify( data ) );

			this.status.classList.remove( 'up-to-date' );
			this.status.classList.add( 'loading' );
			this.status.innerText = 'Loading...';

		} else {

			this.result.clear();

		}

	}

}

export { Output };
