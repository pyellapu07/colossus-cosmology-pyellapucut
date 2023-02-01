import cosmology from '../../config/cosmology.js';
import cosmologyFormat from '../../config/cosmologyFormat.js';
import { Input } from './Input.js';

class Model {

	constructor( type, data ) {

		this.cosmo = cosmology[ type ];
		this.data = data;

		this.params = {};
		this.elems = {};

		for ( const option in cosmologyFormat ) {

			this.createOption( option, cosmologyFormat[ option ] );

		}

		for ( const elem in this.elems )
			this.updateParams( elem, this.params[ elem ], this.elems[ elem ][ 1 ] );

	}

	createOption( name, format ) {

		const type = format.type;
		const dependencies = format.dependencies;

		const onChange = ( event ) => {

			let newValue = type == 'bool' ? event.target.checked : parseFloat( event.target.value );

			if ( newValue !== this.params[ name ] ) {

				this.updateParams( name, newValue, dependencies );
				this.data.needsUpdate();

			}

		};

		const value = this.cosmo[ name ];
		const formattedValue = {
			default: value,
			min: format.min !== undefined ? format.min : 0,
			max: format.max !== undefined ? format.max : Infinity,
			step: format.step !== undefined ? format.step : 0.1,
		};

		const container = new Input( cosmologyFormat[ name ].text, type, type == 'bool' ? value : formattedValue, cosmologyFormat[ name ].def, onChange ).dom;

		this.params[ name ] = value;

		this.elems[ name ] = [ container, dependencies ];

	}

	updateParams( name, value, dependencies ) {

		this.params[ name ] = value;

		if ( dependencies != undefined ) {

			for ( const key in dependencies ) {

				this.elems[ key ][ 0 ].style.display = dependencies[ key ] == value ? '' : 'none';

			}

		}

	}

}

export { Model };
