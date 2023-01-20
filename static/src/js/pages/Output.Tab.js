import { Tabs } from '../components/Tabs.js';
import { Input } from '../components/Input.js';

class OutputTab {


	constructor( data ) {

		const tab = this.dom = document.createElement( 'div' );
		tab.id = 'tab';

		const header = document.createElement( 'div' );
		header.classList.add( 'header' );
		tab.appendChild( header );

		const content = document.createElement( 'table' );
		content.classList.add( 'content' );
		tab.appendChild( content );

		let activeTab;

		for ( const name in Tabs ) {

			const tabContainer = {
				button: undefined,
				inputs: [],
				data: {}
			};

			// header tabs
			const button = document.createElement( 'button' );
			button.innerText = name;
			tabContainer.button = button;
			header.appendChild( button );

			// content
			for ( const input of Tabs[ name ] ) {

				const label = input.label;
				const type = input.type;
				const value = input.value;

				switch ( type ) {

					case 'float':
						tabContainer.data[ label ] = value.default;
						break;
					case 'radio':
						tabContainer.data[ label ] = value[ 0 ];
						break;
					case 'range':
						tabContainer.data[ label ] = [ value.default[ 0 ], value.default[ 1 ] ];
						break;

				}

				const elem = new Input( label, type, value, 'UNDEFINED', ( event ) => {

					switch ( type ) {

						case 'float':
							tabContainer.data[ label ] = parseFloat( event.target.value );
							break;
						case 'radio':
							tabContainer.data[ label ] = event.target.value;
							break;
						case 'range':
							tabContainer.data[ label ][ event.target.dataset.type == 'min' ? 0 : 1 ] = parseFloat( event.target.value );
							break;

					}

					data.needsUpdate();

				} );

				content.appendChild( elem.dom );
				tabContainer.inputs.push( elem.dom );

			}

			function onTabSwitch() {

				if ( activeTab != undefined ) {

					delete activeTab.button.dataset.selected;

					for ( const input of activeTab.inputs ) {

						delete input.dataset.selected;

					}

				}

				button.dataset.selected = '';
				activeTab = tabContainer;

				for ( const input of tabContainer.inputs ) {

					input.dataset.selected = '';

				}

				data.tab = {
					'name': name,
					'inputs': tabContainer.data,
				};
				data.needsUpdate();

			}

			// switching tabs
			button.addEventListener( 'click', onTabSwitch );

			if ( name == 'Basic' )
				onTabSwitch();

		}

	}

}

export { OutputTab };
