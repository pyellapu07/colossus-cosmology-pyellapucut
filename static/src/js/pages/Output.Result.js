class OutputResult {

	constructor() {

		const dom = this.dom = document.createElement( 'div' );
		dom.id = 'result';

	}

	visualize( responseData ) {

		this.dom.innerHTML = '';

		for ( const data of responseData ) {

			switch ( data.type ) {

				case 'table':
					this.tabulate( data.csv );
					break;

			}

		}

	}

	tabulate( csv ) {

		const table = document.createElement( 'table' );

		for ( const row of csv ) {

			const tr = document.createElement( 'tr' );

			if ( row.length > 1 ) {

				for ( const cell of row ) {

					const td = document.createElement( 'td' );
					td.innerText = cell;

					tr.appendChild( td );

				}

			} else {

				const th = document.createElement( 'th' );
				th.colSpan = 100;
				th.innerText = row[ 0 ];

				tr.appendChild( th );

			}

			table.appendChild( tr );

		}

		this.dom.appendChild( table );

	}

	plot() {

	}

}

export { OutputResult };
