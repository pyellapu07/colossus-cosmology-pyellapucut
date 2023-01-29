import cosmoModule from '../../config/cosmoModule.json' assert { type: "json" };
import '../../../dist/plotly.min.js'; // Plotly
import { Tooltip } from '../components/Tooltip.js';

class OutputResult {

	constructor() {

		const dom = this.dom = document.createElement( 'div' );
		dom.id = 'result';

	}

	clear() {
		this.dom.innerHTML = '';
	}

	visualize( responseData, status ) {

		this.clear();

		if (status === 200) {
			for ( const data of responseData ) {

				switch ( data.type ) {

					case 'table':
						this.tabulate( data.csv );
						break;
					case 'plot':
						this.plot( data.x, data.y, data.names, data.title, data.xTitle, data.yTitle );
						break;

				}

			}
		} else if (status === 500) {
			this.error(responseData);
		}

	}

	error(responseData) {
		const frame = document.createElement('iframe');
		frame.srcdoc = responseData;

		frame.addEventListener("load", () => {
			const style = getComputedStyle(frame);
			frame.style.height = frame.contentWindow.document.documentElement.offsetHeight + 100 + 'px';
		});

		this.dom.appendChild(frame);

	}

	tabulate( csv ) {

		const table = document.createElement( 'table' );
		let currentSection;

		for ( const row of csv ) {

			const tr = document.createElement( 'tr' );

			if ( row[0] in cosmoModule ) {

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

					const labelInfo = cosmoModule[currentSection][td.innerText];

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

	plot(x, y, names, title, xTitle, yTitle) {

		const plot = document.createElement('div');
		plot.classList.add('plot');

		// x is an array where y is a 2d array

		const lines = []

		for (let i = 0; i < y.length; i++)

			lines.push({
				'x': x,
				'y': y[i],
				'name': names[i]
			})

		Plotly.newPlot( plot,
			lines,
			{
				title: title,
				xaxis: {
					title: xTitle,
					rangemode: 'tozero'
				},
				yaxis: {
					title: yTitle,
					rangemode: 'tozero'
				}
			}
		);

		this.dom.appendChild(plot);

	}

}

export { OutputResult };
