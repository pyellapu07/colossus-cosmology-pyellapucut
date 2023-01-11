import { Tooltip } from './Tooltip.js';

let counter = 0;

class Input {

	constructor( label, type, value, def, onChange ) {

		const dom = this.dom = document.createElement( 'div' );
		dom.classList.add( 'input-container' );

		const title = document.createElement( 'label' );
		title.innerHTML = label;
		dom.appendChild( title );

		const tooltip = new Tooltip( title, def );

		const input = type == 'radio' ? [] : document.createElement( 'input' );
		const inputContainer = document.createElement( 'div' );

		const groupId = label + counter ++;

		switch ( type ) {

			case 'bool':
				if ( value == undefined )
					value = true;
				input.type = 'checkbox';
				input.classList.add( 'checkbox' );
				input.checked = value;
				break;
			case 'float':
				if ( value == undefined )
					value = 0;
				input.type = 'number';
				input.classList.add( 'textbox' );
				input.value = value;
				break;
			case 'radio':
				for ( const v of value ) {

					const radioContainer = document.createElement( 'div' );
					radioContainer.classList.add( 'radio-container' );

					const uniqueId = label + v + counter ++;

					const secondaryLabel = document.createElement( 'label' );
					secondaryLabel.innerText = v;
					secondaryLabel.htmlFor = uniqueId;

					const radio = document.createElement( 'input' );
					radio.type = 'radio';
					radio.id = uniqueId;
					radio.name = groupId;
					radio.classList.add( 'radio' );

					input.push( radio );

					radioContainer.appendChild( radio );
					radioContainer.appendChild( secondaryLabel );

					inputContainer.appendChild( radioContainer );

				}

				input[ 0 ].checked = true;
				dom.appendChild( inputContainer );

				break;

		}

		if ( type === 'radio' ) {

			for ( const radio of input ) {

				radio.addEventListener( 'change', onChange );

			}

			dom.appendChild( inputContainer );

		} else {

			input.addEventListener( 'change', onChange );
			dom.appendChild( input );

		}

	}

}

export { Input };
