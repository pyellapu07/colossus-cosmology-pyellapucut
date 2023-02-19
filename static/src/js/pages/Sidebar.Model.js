import { Model } from '../components/Model.js';
import { Tooltip } from '../components/Tooltip.js';
import cosmology from '../../config/cosmology.js';

class SidebarModel {

	constructor( data, type ) {

		this.data = data;
		const model = this.model = new Model( type, data );

		const dom = this.dom = document.createElement( 'div' );
		dom.classList.add( 'sidebar-model' );

		// header
		const header = document.createElement( 'div' );
		header.classList.add( 'sidebar-header' );

		// header expand toggle
		const expandToggle = document.createElement( 'div' );
		expandToggle.classList.add( 'expand-toggle', 'icon-button' );
		header.appendChild( expandToggle );

		const expandTooltip = new Tooltip( expandToggle, 'Expand model' );

		// header title
		const headerTitle = document.createElement( 'input' );
		headerTitle.value = this.addName( cosmology[type].longname );
		headerTitle.classList.add( 'model-name' );

		headerTitle.addEventListener( 'input', this.resizeTitle );
		headerTitle.addEventListener( 'change', ( e ) => {

			if ( e.target.value == '' )
				e.target.value = this.addName( 'Model' );
			else
				e.target.value = this.addName( e.target.value, headerTitle );

			this.resizeTitle.call( headerTitle );

			data.needsUpdate();

		} );

		this.resizeTitle.call( headerTitle );

		header.appendChild( headerTitle );

		// header enable toggle
		const enabledToggle = document.createElement( 'div' );
		enabledToggle.classList.add( 'checkbox', 'enable-toggle' );
		enabledToggle.dataset.checked = '';

		enabledToggle.addEventListener( 'click', () => {

			if ( 'checked' in enabledToggle.dataset ) {

				delete enabledToggle.dataset.checked;
				data.disabled.push( this.model.params );

			} else {

				enabledToggle.dataset.checked = '';
				data.disabled.splice( data.disabled.indexOf( this.model.params ), 1 );

			}

			data.needsUpdate();

		} );

		header.appendChild( enabledToggle );

		const enabledTooltip = new Tooltip( enabledToggle, 'Show/hide in output' );

		// header delete
		const trash = document.createElement( 'button' );
		trash.classList.add( 'trash', 'icon-button' );
		header.appendChild( trash );

		const trashTooltip = new Tooltip( trash, 'Delete model' );

		// body
		const body = document.createElement( 'table' );
		body.classList.add( 'sidebar-body' );

		// body expand toggle
		let open = true;

		header.addEventListener( 'click', function ( e ) {

			if ( e.target == header || e.target == expandToggle ) {

				open = ! open;

				if ( open ) {

					body.style.removeProperty( 'display' );
					delete expandToggle.dataset.collapse;

				} else {

					body.style.display = 'none';
					expandToggle.dataset.collapse = '';

				}

			}

		} );

		trash.addEventListener( 'click', () => {

			data.models.splice( data.models.indexOf( this.model.params ), 1 );
			if ( data.disabled.indexOf( this.model.params ) !== - 1 )
				data.disabled.splice( data.disabled.indexOf( this.model.params ), 1 );
			data.needsUpdate();

			dom.remove();

		} );

		dom.appendChild( header );

		for ( const elem in model.elems ) {

			body.appendChild( model.elems[ elem ][ 0 ] );

		}

		dom.appendChild( body );

	}

	resizeTitle() {

		this.style.width = this.value.length + 2 + 'ch';

	}

	addName( name, instance ) {

		let uniqueName;

		const names = [];
		const modelNames = document.getElementsByClassName( 'model-name' );
		for ( let i = 0; i < modelNames.length; i ++ ) {

			if ( instance != modelNames[ i ] )
				names.push( modelNames[ i ].value );

		}

		if ( names.includes( name ) ) {

			let i = 1;
			while ( names.includes( name + ' (' + i + ')' ) )
				i ++;
			uniqueName = name + ' (' + i + ')';

		} else {

			uniqueName = name;

		}

		names.push( uniqueName );

		this.model.params.name = uniqueName;

		return uniqueName;

	}

}

export { SidebarModel };
