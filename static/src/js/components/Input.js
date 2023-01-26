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
				input.value = value.default;
				input.min = value.min;
				input.max = value.max;
				input.step = value.step;
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
				minBox.value = value.default[ 0 ];
				minBox.min = value.min;

				const maxBox = document.createElement( 'input' );
				maxBox.type = 'number';
				maxBox.classList.add( 'textbox' );
				maxBox.dataset.type = 'max';
				maxBox.value = value.default[ 1 ];
				maxBox.max = value.max;

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

		function onChangeWrapper( e ) {

			let newValue;

			if ( type == 'bool' ) {

				newValue = event.target.checked;

			} else if ( type === 'float' || type === 'range' ) {

				newValue = parseFloat( event.target.value );

				if ( event.target.min !== undefined && newValue < parseFloat( event.target.min ) )
					newValue = parseFloat( event.target.min );
				if ( event.target.max !== undefined && newValue > parseFloat( event.target.max ) )
					newValue = parseFloat( event.target.max );

			} else {

				newValue = event.target.value;

			}

			event.target.value = newValue;

			onChange( e );

		}

		if ( input instanceof Array ) {

			for ( const i of input ) {

				i.addEventListener( 'change', onChangeWrapper );

			}

		} else {

			input.addEventListener( 'change', onChangeWrapper );
			inputWrapper.appendChild( input );

		}

		dom.appendChild( inputWrapper );

	}

}

export { Input };
