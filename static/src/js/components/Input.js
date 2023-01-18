import { Tooltip } from './Tooltip.js';

let counter = 0;

class Input {

	constructor( label, type, value, def, onChange ) {

		const dom = this.dom = document.createElement( 'tr' );
		dom.classList.add( 'input-container' );

		const titleWrapper = document.createElement( 'td' );
		titleWrapper.classList.add( 'title-wrapper' );
		dom.appendChild( titleWrapper );

		const title = document.createElement( 'label' );
		title.classList.add( 'title' );
		title.innerHTML = label;
		titleWrapper.appendChild( title );

		const tooltip = new Tooltip( title, def );

		const input = type == 'radio' || type == 'range' ? [] : document.createElement( 'input' );
		const inputWrapper = document.createElement( 'td' );
		inputWrapper.classList.add( 'input-wrapper' );

		const groupId = label + counter ++;

		switch ( type ) {

			case 'bool':
				input.type = 'checkbox';
				input.classList.add( 'checkbox' );
				input.checked = value;
				break;
			case 'float':
				input.type = 'number';
				input.classList.add( 'textbox' );
				input.value = value;
				input.min = 0;
				break;
			case 'range':
				const minFieldset = document.createElement( 'fieldset' );
				minFieldset.classList.add( 'fieldset' );

				const maxFieldset = document.createElement( 'fieldset' );
				maxFieldset.classList.add( 'fieldset' );

				const minLabel = document.createElement( 'label' );
				minLabel.innerText = 'min';

				const maxLabel = document.createElement( 'label' );
				maxLabel.innerText = 'max';

				const minBox = document.createElement( 'input' );
				minBox.type = 'number';
				minBox.classList.add( 'textbox' );
				minBox.dataset.type = 'min';
				minBox.value = value[ 0 ];
				minBox.min = value[ 1 ];

				const maxBox = document.createElement( 'input' );
				maxBox.type = 'number';
				maxBox.classList.add( 'textbox' );
				maxBox.dataset.type = 'max';
				maxBox.value = value[ 2 ];
				maxBox.max = value[ 3 ];

				input.push( minBox );
				input.push( maxBox );

				minFieldset.appendChild( minLabel );
				minFieldset.appendChild( minBox );
				maxFieldset.appendChild( maxLabel );
				maxFieldset.appendChild( maxBox );

				inputWrapper.appendChild( minFieldset );
				inputWrapper.appendChild( maxFieldset );

				break;
			case 'radio':
				for ( const v of value ) {

					const fieldset = document.createElement( 'fieldset' );
					fieldset.classList.add( 'fieldset' );

					const uniqueId = label + v + counter ++;

					const secondaryLabel = document.createElement( 'label' );
					secondaryLabel.innerText = v;
					secondaryLabel.htmlFor = uniqueId;

					const radio = document.createElement( 'input' );
					radio.type = 'radio';
					radio.id = uniqueId;
					radio.name = groupId;
					radio.value = v;
					radio.classList.add( 'radio' );

					input.push( radio );

					fieldset.appendChild( radio );
					fieldset.appendChild( secondaryLabel );

					inputWrapper.appendChild( fieldset );

				}

				input[ 0 ].checked = true;
				break;

		}

		if ( input instanceof Array ) {

			for ( const i of input ) {

				i.addEventListener( 'change', onChange );

			}

		} else {

			input.addEventListener( 'change', onChange );
			inputWrapper.appendChild( input );

		}

		dom.appendChild( inputWrapper );

	}

}

export { Input };
