import basicTable from '../../config/basicTable.json' assert { type: "json" };
import { Tooltip } from '../components/Tooltip.js';

class OutputResult {

	constructor() {

		const dom = this.dom = document.createElement( 'div' );
		dom.id = 'result';

	}

	clear() {
		this.dom.innerHTML = '';
	}

	visualize( responseData ) {

		this.clear();

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
		let currentSection;

		for ( const row of csv ) {

			const tr = document.createElement( 'tr' );

			if ( row[0] in basicTable ) {

				const th = document.createElement( 'th' );
				th.colSpan = 100;
				th.innerText = currentSection = row[ 0 ];

				tr.appendChild( th );

			} else {

				for ( const cell of row ) {

					const td = document.createElement( 'td' );
					td.innerText = cell;

					tr.appendChild( td );

				}

				if (currentSection !== undefined) {

					const td = tr.firstChild;

					const labelInfo = basicTable[currentSection][td.innerText];

					const label = document.createElement('label');
					label.innerText = td.innerText;

					if (labelInfo.unit !== '')
						label.innerHTML = label.innerHTML + ' (' + labelInfo.unit + ')';

					td.innerText = '';

					td.appendChild(label);

					const tooltip = new Tooltip( label, labelInfo.def );
				}

			}

			table.appendChild( tr );

		}

		this.dom.appendChild(table);

	}

	plot() {

	}

}

export { OutputResult };
