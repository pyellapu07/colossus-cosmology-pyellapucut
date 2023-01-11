import { CosmologyFormat } from './Cosmology.js';
import { Input } from './Input.js';

class Model {

	constructor( body, cosmo ) {

		this.body = body;
		this.cosmo = cosmo;
		this.params = {};
		this.elems = {};

		this.createOption( 'flat', 'bool', { 'Ode0': false } );
		this.createOption( 'H0', 'float' );
		this.createOption( 'Om0', 'float' );
		this.createOption( 'Ob0', 'float' );
		this.createOption( 'Ode0', 'float' );
		this.createOption( 'sigma8', 'float' );
		this.createOption( 'ns', 'float' );
		this.createOption( 'relspecies', 'bool' );

		for ( const elem in this.elems )
			this.updateParams( elem, this.params[ elem ], this.elems[ elem ][ 1 ] );

	}

	createOption( name, type, dependencies ) {

		let value = this.cosmo[ name ];

		const onChange = ( event ) => {

			this.updateParams( name, type == 'bool' ? event.target.checked : event.target.value, dependencies );

		};

		const container = new Input( CosmologyFormat[ name ].text, type, value, CosmologyFormat[ name ].def, onChange ).dom;

		this.params[ name ] = value;

		this.elems[ name ] = [ container, dependencies ];
		this.body.appendChild( container );

	}

	updateParams( name, value, dependencies ) {

		this.params[ name ] = event.target.checked;

		if ( dependencies != undefined ) {

			for ( const key in dependencies ) {

				this.elems[ key ][ 0 ].style.display = dependencies[ key ] == value ? '' : 'none';

			}

		}

	}

}

export { Model };
